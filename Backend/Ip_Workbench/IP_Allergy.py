from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
import json
from django.http import JsonResponse
from .models import *
from django.utils.timezone import now






@csrf_exempt
@require_http_methods(['POST', 'GET'])
def IP_Allergy_Details_Link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            RegistrationId = data.get("RegistrationId")
            AllergyType = data.get("AllergyType")
            Allergent = data.get("Allergent")
            Reaction = data.get("Reaction")
            Remarks = data.get("Remarks")
            DepartmentType = data.get("DepartmentType")
            createdby = data.get("Createdby")
            
            registration_ins_ip = None
            registration_ins_casuality = None
            
            print(f"Received RegistrationId: {RegistrationId}")  # Debugging line
            
            if RegistrationId:
                # Try to get from IP Registration first
                try:
                    registration_ins_ip = Patient_IP_Registration_Detials.objects.get(pk=RegistrationId)
                    print("Found in IP Registration")
                except Patient_IP_Registration_Detials.DoesNotExist:
                    print("Not found in IP Registration, trying Casuality Registration")
                    try:
                        registration_ins_casuality = Patient_Casuality_Registration_Detials.objects.get(pk=RegistrationId)
                        print("Found in Casuality Registration")
                    except Patient_Casuality_Registration_Detials.DoesNotExist:
                        return JsonResponse({'error': 'No registration found for the given RegistrationId'})

            else:
                return JsonResponse({'error': 'RegistrationId is required'})

            # Save Allergy details
            Allergy_instance = IP_Allergy_Details(
                Ip_Registration_Id=registration_ins_ip,
                Casuality_Registration_Id=registration_ins_casuality,
                DepartmentType=DepartmentType,
                AllergyType=AllergyType,
                Allergent=Allergent,
                Reaction=Reaction,
                Remarks=Remarks,
                Created_by=createdby,
            )
            Allergy_instance.save()
            
            return JsonResponse({'success': 'Allergy details saved successfully'})

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

    elif request.method == 'GET':
        try:
            
            Ip_Registration_Id = request.GET.get('RegistrationId')
            DepartmentType = request.GET.get('DepartmentType')
            
            if not Ip_Registration_Id and not DepartmentType:
                return JsonResponse({'error': 'both Ip_Registration_Id and DepartmentType is required'})

            if DepartmentType=='IP':
                AllergyHistory_Details = IP_Allergy_Details.objects.filter(Ip_Registration_Id__pk=Ip_Registration_Id, DepartmentType=DepartmentType)
            else:
                AllergyHistory_Details = IP_Allergy_Details.objects.filter(Casuality_Registration_Id__pk=Ip_Registration_Id, DepartmentType=DepartmentType)
            
            
            # Serialize data
            AllergyHistory_Details_data = []
            for idx, Allergy in enumerate(AllergyHistory_Details, start=1):
                Allergy_dict = {
                    'id': idx,
                    'RegistrationId': Allergy.Ip_Registration_Id.pk if Allergy.Ip_Registration_Id else Allergy.Casuality_Registration_Id.pk,
                    # 'VisitId': Allergy.Ip_Registration_Id.VisitId if Allergy.Ip_Registration_Id else Allergy.Casuality_Registration_Id.VisitId,
                    'PrimaryDoctorId': Allergy.Ip_Registration_Id.PrimaryDoctor.Doctor_ID if Allergy.Ip_Registration_Id else Allergy.Casuality_Registration_Id.PrimaryDoctor.Doctor_ID,
                    'PrimaryDoctorName': Allergy.Ip_Registration_Id.PrimaryDoctor.ShortName if Allergy.Ip_Registration_Id else Allergy.Casuality_Registration_Id.PrimaryDoctor.ShortName,
                    'AllergyType': Allergy.AllergyType,
                    'Allergent': Allergy.Allergent,
                    'Reaction': Allergy.Reaction,
                    'Remarks': Allergy.Remarks,
                    'DepartmentType': Allergy.DepartmentType,
                    'Date': Allergy.created_at.strftime('%d-%m-%y'),
                    'Time': Allergy.created_at.strftime('%H:%M:%S'),
                    'Createdby': Allergy.Created_by,
                }
                AllergyHistory_Details_data.append(Allergy_dict)

            return JsonResponse(AllergyHistory_Details_data, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)






