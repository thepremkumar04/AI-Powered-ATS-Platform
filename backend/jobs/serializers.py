from rest_framework import serializers
from .models import Job, Application

class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = '__all__'

class ApplicationSerializer(serializers.ModelSerializer):
    # 🟢 Ee 3 custom fields ni ikkada declare chestunnam
    company_name = serializers.CharField(source='job.company', read_only=True)
    job_title = serializers.CharField(source='job.title', read_only=True)
    candidate = serializers.ReadOnlyField(source='candidate.username')

    class Meta:
        model = Application
        # 🟢 Anni fields ni okate list lo pettesam, inka errors ravu!
        fields = [
            'id', 'job', 'candidate', 'resume', 'status', 'applied_at', 
            'ats_score', 'feedback', 'interview_questions', 'job_title', 'company_name'
        ]