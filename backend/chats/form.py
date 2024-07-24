from django import forms
from .models import Chat, Message
class ChatAdminForm(forms.ModelForm):
    class Meta:
        model = Chat
        fields = ['user1', 'user2']

    def clean(self):
        cleaned_data = super().clean()
        user1 = cleaned_data.get('user1')
        user2 = cleaned_data.get('user2')

        if not user1 or not user2:
            raise forms.ValidationError("Both user1 and user2 must be set.")
        if user1 == user2:
            raise forms.ValidationError("A chat cannot be between the same user.")
        return cleaned_data

class MessageAdminForm(forms.ModelForm):
    class Meta:
        model = Message
        fields = '__all__'