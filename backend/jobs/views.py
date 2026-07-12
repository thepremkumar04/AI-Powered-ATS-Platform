import PyPDF2
import requests # Direct ga matladataniki!
import re
import json
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
from .models import Job, Application
from .serializers import JobSerializer, ApplicationSerializer
from django.core.mail import send_mail

class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.all().order_by('-created_at')
    serializer_class = JobSerializer

class ApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Application.objects.none()
        if user.role == 'recruiter' or user.is_superuser:
            return Application.objects.all().order_by('-applied_at')
        return Application.objects.filter(candidate=user).order_by('-applied_at')

    def calculate_ats_score(self, resume_file, job):
        import json # JSON format read cheyadaniki
        try:
            reader = PyPDF2.PdfReader(resume_file)
            resume_text = ""
            for page in reader.pages:
                text = page.extract_text()
                if text:
                    resume_text += text

            # 🟢 Prompt ni motham marchesam (JSON format kosam)
            prompt = f"""
            You are an expert strict ATS (Applicant Tracking System). 
            Compare the Resume Text with the Job Title and Description.
            Return ONLY a valid JSON object (without any markdown or code blocks) with this exact structure:
            {{
                "score": <integer from 0 to 100>,
                "feedback": "<1 short sentence explaining why this score was given, highlighting missing skills>",
                "questions": "<2 technical interview questions based on their resume to test their skills>"
            }}
            
            Job Title: {job.title}
            Job Description: {job.description}
            Resume Text: {resume_text}
            """
            
            api_key = settings.GEMINI_API_KEY
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
            
            data = {
                "contents": [{"parts": [{"text": prompt}]}]
            }
            
            response = requests.post(url, json=data, headers={'Content-Type': 'application/json'})
            response_data = response.json()
            
            if 'error' in response_data:
                print("🚨 Google API Error Message:", response_data['error']['message'])
                return 0, "", ""
                
            if 'candidates' not in response_data:
                return 0, "", ""

            ai_text = response_data['candidates'][0]['content']['parts'][0]['text']
            print("🤖 Gemini Raw Response:", ai_text)
            
            # 🟢 Clean the AI response (removing markdown like ```json )
            clean_text = ai_text.replace('```json', '').replace('```', '').strip()
            
            # 🟢 Convert text to Python Dictionary
            ai_data = json.loads(clean_text)
            
            score = int(ai_data.get('score', 0))
            feedback = ai_data.get('feedback', '')
            questions = ai_data.get('questions', '')
            
            return max(0, min(100, score)), feedback, questions
            
        except Exception as e:
            print("❌ AI Processing Error:", e)
            return 0, "Error generating feedback.", ""

    # 🟢 Ikkada kuda update chesam (3 values theeskuni save chestunnam)
    def perform_create(self, serializer):
        resume_file = self.request.FILES.get('resume')
        job = serializer.validated_data['job']
        ats_score, feedback, interview_questions = self.calculate_ats_score(resume_file, job)
        serializer.save(
            candidate=self.request.user, 
            ats_score=ats_score, 
            feedback=feedback, 
            interview_questions=interview_questions
        )
        
    # 🟢 Record update ayinappudu ee function run avtundi
    def perform_update(self, serializer):
        # Mundu database lo save chestunnam
        instance = serializer.save()

        # Request lo kothaga emaina status vachinda ani check chestunnam
        if 'status' in self.request.data:
            new_status = self.request.data['status'].lower()
            candidate_email = instance.candidate.email # Candidate register ayyina email
            candidate_name = instance.candidate.username

            # Okavela Shortlist aithe..
            if new_status == 'shortlisted' and candidate_email:
                subject = f"🎉 Congratulations! You are shortlisted for {instance.job.title}"
                message = f"""Hi {candidate_name},

Great news! Your resume has been shortlisted for the {instance.job.title} position at {instance.job.company}. 

Your impressive ATS Score and AI Feedback caught our recruiter's eye. Our HR team will contact you shortly to schedule the interview rounds.

Best Regards,
Talent Acquisition Team
{instance.job.company}"""

                # Mail pampe try chestunnam
                try:
                    send_mail(
                        subject, 
                        message, 
                        settings.EMAIL_HOST_USER, 
                        [candidate_email],
                        fail_silently=False
                    )
                    print(f"✅ Email successfully sent to {candidate_email}!")
                except Exception as e:
                    print(f"❌ Email sending failed: {e}")