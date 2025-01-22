
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.db.models import Q
from .models import *
from Masters.models import *
from Frontoffice.models import *
from django.utils.timezone import now
import base64
import filetype
# import magic
from PIL import Image
from datetime import datetime
from io import BytesIO
from PyPDF2 import PdfReader, PdfWriter
from docx import Document
from django.db.models.functions import Cast
from django.db.models import IntegerField  # or any other type you want to cast to



@csrf_exempt
@require_http_methods(["POST", "GET", "OPTIONS"])
def ReferDoctor_Details_link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print(data)
            ReferId = data.get("ReferId", '')
            PrimaryDoctorId = data.get("DoctorID", '')
            VisitId = data.get("VisitId", '')
            PatientId = data.get("PatientId", '')
            DoctorType = data.get("doctorType", '')
            Remarks = data.get("remarks", '')
            ReferDoctorId = data.get("doctorName", '')
            Statusedit = data.get('Statusedit', False)
            created_by = data.get('created_by', '')

            # Fetch the primary doctor instance
            
            doctor_register_instance = Doctor_Personal_Form_Detials.objects.get(pk=PrimaryDoctorId)
            print(doctor_register_instance)
            
            # Fetch the referred doctor instance, if provided
            refer_register_instance = Doctor_Personal_Form_Detials.objects.get(pk=ReferDoctorId) if ReferDoctorId else None
            print(refer_register_instance)
            
            if refer_register_instance:
                
                refer_register_instancetype = refer_register_instance.DoctorType
                print(f"ReferDoctorType: {refer_register_instancetype}")
            else:
                refer_register_instancetype = DoctorType
                
            
            # Create a new referral entry
            ReferalDoctorDetails.objects.create(
                PatientId=PatientId,
                VisitId=VisitId,
                PrimaryDoctorId=doctor_register_instance,
                ReferDoctorId=refer_register_instance,
                ReferDoctorType=refer_register_instancetype,
                Remarks=Remarks,
                created_by=created_by
            )

            return JsonResponse({'success': 'Refer a Doctor added successfully'}, status=200)

        except Doctor_Personal_Form_Detials.DoesNotExist:
            return JsonResponse({'warn': 'Doctor not found'})
        except Exception as e:
            return JsonResponse({'error': 'An error occurred while processing your request'}, status=500)

    elif request.method == 'GET':
        try:
            PatientId = request.GET.get('PatientId', None)
            VisitId = request.GET.get('VisitId', None)
            filters = {}
            if PatientId:
                filters['PatientId'] = PatientId
            if VisitId:
                filters['VisitId'] = VisitId

            refer_doctors = ReferalDoctorDetails.objects.filter(**filters)
            refer_data = []
            index = 1

            
            for refer in refer_doctors:
                primary_doctor_name = f"{refer.PrimaryDoctorId.Tittle} {refer.PrimaryDoctorId.First_Name} {refer.PrimaryDoctorId.Middle_Name} {refer.PrimaryDoctorId.Last_Name}".strip()
                refer_doctor_name = f"{refer.ReferDoctorId.Tittle} {refer.ReferDoctorId.First_Name} {refer.ReferDoctorId.Middle_Name} {refer.ReferDoctorId.Last_Name}".strip() if refer.ReferDoctorId else 'N/A'

                refer_data.append({
                    'id': index,
                    'ReferId': refer.Refer_Id,
                    'PatientId': refer.PatientId,
                    'VisitId': refer.VisitId,
                    'PrimaryDoctorId': refer.PrimaryDoctorId.pk if refer.PrimaryDoctorId else None,
                    'PrimaryDoctorName': primary_doctor_name,
                    'ReferDoctorId': refer.ReferDoctorId.pk if refer.ReferDoctorId else None,
                    'ReferDoctorName': refer_doctor_name,
                    'DoctorType': refer.ReferDoctorType,
                    'Remarks': refer.Remarks,
                    'Status': 'Active' if refer.Status else 'Inactive',
                    'created_by': refer.created_by
                })
                index += 1
            return JsonResponse(refer_data, safe=False)

        except Exception as e:
            return JsonResponse({'error': str(e)})
    # Ensure there's an HttpResponse in every code path
    return JsonResponse({'error': 'Invalid request method'},status=405)


@csrf_exempt
@require_http_methods(["POST", "GET", "OPTIONS"])
def Lab_Request_Detailslink(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            # Extract data from the request
            lab_queue_id = data.get("LabQueueId", "")
            created_by = data.get("created_by", "")
            registration_id = data.get("Register_Id", None)
            register_type = data.get("RegisterType", "")
            SelectedTest = data.get("SelectedTest", [])
            location = data.get("location")
            Remarks = data.get("Remarks")
            if registration_id is None or register_type not in [
                "OP",
                "IP",
                "Casuality",
            ]:
                return JsonResponse(
                    {"warn": "Missing or invalid registration ID or registration type"}
                )
            # Prepare the arguments based on the register type
            register_kwargs = {"RegisterType": register_type}
            OPQueue = None
            # register_args = {}
            if register_type == "OP":
                try:
                    op_register_instance = (
                        Patient_Appointment_Registration_Detials.objects.get(
                            Registration_Id=registration_id
                        )
                    )
                    register_kwargs["OP_Register_Id"] = op_register_instance
                    # register_args["DoctorID"] = op_register_instance.DoctorId
                    OPQueue = op_register_instance
                except Patient_Appointment_Registration_Detials.DoesNotExist:
                    return JsonResponse({"warn": "OP Registration ID not found"})
            elif register_type == "IP":
                try:
                    ip_register_instance = Patient_IP_Registration_Detials.objects.get(
                        Registration_Id=registration_id
                    )
                    register_kwargs["IP_Register_Id"] = ip_register_instance
                    OPQueue = ip_register_instance
                except Patient_IP_Registration_Detials.DoesNotExist:
                    return JsonResponse({"warn": "IP Registration ID not found"})
            elif register_type == "Casuality":
                try:
                    casuality_register_instance = (
                        Patient_Casuality_Registration_Detials.objects.get(
                            Registration_Id=registration_id
                        )
                    )
                    register_kwargs["Casuality_Register_Id"] = (
                        casuality_register_instance
                    )
                    OPQueue = casuality_register_instance
                except Patient_Casuality_Registration_Detials.DoesNotExist:
                    return JsonResponse({"warn": "Casuality Registration ID not found"})
            # Insert into Lab_Request_Details
            Location_instance = Location_Detials.objects.get(Location_Id=location)
            lab_request = Lab_Request_Details.objects.create(
                created_by=created_by,
                Location=Location_instance,
                Remarks=Remarks,
                **register_kwargs,
            )
            # Loop through SelectedTest and insert into Lab_Request_Items_Details
            for test in SelectedTest:
                SubDepartment_Code = test.get("SubDepartment_Code")
                testType = test.get("testType")
                Department_Code = test.get("Department_Code")
                Code = test.get("Code")
                max_item_id1 = Lab_Request_Items_Details.objects.annotate(
                    Item_Id_as_int=Cast("Item_Id", output_field=IntegerField())
                ).aggregate(Max("Item_Id_as_int"))
                max_item_id = max_item_id1["Item_Id_as_int__max"]
                print("max_item_id :", max_item_id)

                if max_item_id is None:
                    newid = 1
                else:
                    newid = max_item_id + 1
                lab_request_item_data = {
                    "Item_Id": newid,
                    "Request": lab_request,
                    "TestType": testType,
                    "SubDepartment_Code_id": SubDepartment_Code,
                    "Department_Code_id": Department_Code,
                }
                if testType == "Individual":
                    lab_request_item_data["Test_Code_id"] = (
                        Code  
                    )
                elif testType == "Profiles":
                    lab_request_item_data["Group_Code_id"] = (
                        Code  
                    )
                # Save the item
                Lab_Request_Items_Details.objects.create(**lab_request_item_data)
            
            print('OPQueue.DoctorId :',OPQueue.PrimaryDoctor)
            ratecard = Doctor_Ratecard_Master.objects.get(Doctor_ID=OPQueue.PrimaryDoctor.Doctor_ID)
            print('ratecard :',ratecard)
            if register_type == "OP":
                OP_Billing_QueueList_Detials.objects.create(
                    BillingQueueList_ID = lab_request.Request_Id,
                        Billing_Type="Lab",
                        Registration_Id = OPQueue,
                        Status="Pending",
                        Doctor_Ratecard_Id = ratecard,
                        created_by=created_by,
                    )
            elif register_type == "IP":
                IP_Billing_QueueList_Detials.objects.create(
                    BillingQueueList_ID = lab_request.Request_Id,
                        Billing_Type="Lab",
                        Registration_Id = OPQueue,
                        Status="Pending",
                        Doctor_Ratecard_Id = ratecard,
                        created_by=created_by,
                    )
            return JsonResponse({"success": "Data saved successfully"}, status=200)
        except Exception as e:
            print("Exception:", e)
            return JsonResponse({"error": "An internal server error occurred"}, status=500)
        
    elif request.method == 'GET':
        try:
            # Extract query parameters
            registration_id = request.GET.get('Register_Id', None)
            register_type = request.GET.get('RegisterType', None)

            if not registration_id:
                return JsonResponse({'warn': 'Missing registration ID'})
            if register_type not in ["OP", "IP", "Casuality"]:
                return JsonResponse({'warn': 'Missing or invalid Register Type'})

            # Fetch the registration details, including related patient and doctor details
            if register_type == "OP":
                registration_details = Patient_Appointment_Registration_Detials.objects.select_related('PatientId', 'PrimaryDoctor').get(pk=registration_id)
            elif register_type == "IP":
                registration_details = Patient_IP_Registration_Detials.objects.select_related('PatientId', 'PrimaryDoctor').get(pk=registration_id)
            elif register_type == "Casuality":
                registration_details = Patient_Casuality_Registration_Detials.objects.select_related('PatientId', 'PrimaryDoctor').get(pk=registration_id)

            # Extract patient and doctor details
            patient_id = registration_details.PatientId.PatientId
            patient_name = f"{registration_details.PatientId.FirstName} {registration_details.PatientId.MiddleName} {registration_details.PatientId.SurName}"
            phone_number = registration_details.PatientId.PhoneNo
            doctor_id = registration_details.PrimaryDoctor.Doctor_ID if registration_details.PrimaryDoctor else None
            doctor_name = f"{registration_details.PrimaryDoctor.First_Name} {registration_details.PrimaryDoctor.Last_Name}" if registration_details.PrimaryDoctor else None
            doctor_shortname = registration_details.PrimaryDoctor.ShortName if registration_details.PrimaryDoctor else None

            # Filter Lab_Request_Details by registration_id
            lab_requests = Lab_Request_Details.objects.filter(
                **{
                    f"{register_type}_Register_Id": registration_id
                }
            )

            response_data = []
            index = 1

            for request_item in lab_requests:
                if request_item.TestType == 'Individual':
                    if request_item.IndivitualCode: 
                        response_data.append({
                            'id': index,
                            'PatientId': patient_id,
                            'PatientName': patient_name,
                            'PhoneNumber': phone_number,
                            'DoctorId': doctor_id,
                            'DoctorName': doctor_name,
                            'DoctorShortName': doctor_shortname,
                            'RegisterType': request_item.RegisterType,
                            'TestType': request_item.TestType,
                            'TestCode': request_item.IndivitualCode.TestCode,
                            'TestName': request_item.IndivitualCode.Test_Name
                        })
                        index += 1
                    else:
                        print(f"Individual test missing IndivitualCode for request ID: {request_item.Request_Id}")

                if request_item.TestType == 'Favourites':
                    favourite = request_item.FavouriteCode  
                    if favourite:
                        for test in favourite.TestName.all():
                            response_data.append({
                                'id': index,
                                'PatientId': patient_id,
                                'PatientName': patient_name,
                                'PhoneNumber': phone_number,
                                'DoctorId': doctor_id,
                                'DoctorName': doctor_name,
                                'DoctorShortName': doctor_shortname,
                                'RegisterType': request_item.RegisterType,
                                'TestType': request_item.TestType,
                                'FavouriteCode': favourite.Favourite_Code,
                                'FavouriteName': favourite.FavouriteName,
                                'TestCode': test.TestCode,
                                'TestName': test.Test_Name,
                            })
                            index += 1
                    else:
                        print(f"Favourites test missing FavouriteCode for request ID: {request_item.Request_Id}")
                        
            return JsonResponse(response_data, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'},status=500)


@csrf_exempt
@require_http_methods(["POST", "GET", "OPTIONS"])
def Radiology_Request_Detailslink(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Extract data from the request
            Radiology_queue_id = data.get('RadiologyTestId', '')
            Testname_arr = data.get('SubtestNoArr', [])
            created_by = data.get('created_by', '')
            RegisterType = data.get('RegisterType',None)
            registration_id = data.get('Register_Id', None)
            print(registration_id)
            
            if registration_id is None or RegisterType is None:
                return JsonResponse({'warn': 'Missing registration ID or RegisterType'})
             # Determine the correct registration model and fetch the instance
            registration_instance = None
            if RegisterType == "OP":
                registration_instance = Patient_Appointment_Registration_Detials.objects.filter(pk=registration_id).first()
            elif RegisterType == "IP":
                registration_instance = Patient_IP_Registration_Detials.objects.filter(Registration_Id=registration_id).first()
            elif RegisterType == "Casuality":
                registration_instance = Patient_Casuality_Registration_Detials.objects.filter(pk=registration_id).first()
            elif RegisterType == "ExternalRadiology":
                registration_instance = Patient_Diagnosis_Registration_Detials.objects.filter(pk=registration_id).first()
                
            
            # Process IsSubTest No Tests
            for testname in Testname_arr:
                Radiologyid = testname.get('Radiologyid', None)
                TestCode = testname.get('TestCode', None)
                
                if Radiologyid and TestCode:  # Ensure required fields are present
                    Radiology_Request_Details.objects.create(
                        RegisterType = RegisterType,
                        OP_Register_Id=registration_instance if RegisterType == "OP" else None,
                        IP_Register_Id=registration_instance if RegisterType == "IP" else None,
                        Casuality_Register_Id=registration_instance if RegisterType == "Casuality" else None,
                        Diagnosis_Register_Id=registration_instance if RegisterType == "ExternalRadiology" else None,
                        TestCode=Radiologyid,
                        SubTestCode=TestCode,
                        created_by=created_by
                    )
            
            # Process IsSubTest Yes Tests
            
            return JsonResponse({'success': 'Data Saved successfully'}, status=200)
        
        except Exception as e:
            print("Exception:", e)
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
    
    elif request.method == 'GET':
        try:
            def get_file_image(filedata):
                if filedata is None:
                    return None  # Ret
                try:
                    kind = filetype.guess(filedata)
                    

                        # List of supported MIME types
                    supported_mime_types = [
                            'application/pdf',
                            'image/jpeg',
                            'image/png',
                            'application/msword',  # For .doc files
                            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'  # For .docx files
                    ]

                    contenttype1 = 'application/pdf'
                    if kind:
                        if kind.mime in supported_mime_types:
                            contenttype1 = kind.mime
                    
                    # Return base64 encoded data with MIME type
                    return f'data:{contenttype1};base64,{base64.b64encode(filedata).decode("utf-8")}'
                    
                except Exception as e:
                    print(f"Error processing file: {e}")
                    return None
            
            
            registration_id = request.GET.get('Register_Id', None)
            RegisterType = request.GET.get('RegisterType', None)
            
            if registration_id is None or RegisterType is None:
                return JsonResponse({'warn': 'Missing Registration Id or RegisterType'}, status=400)
            
            # Fetch registration details based on RegisterType
            if RegisterType == "OP":
                registration_details = Patient_Appointment_Registration_Detials.objects.select_related('PatientId', 'PrimaryDoctor').get(pk=registration_id)
                radiology_requests = Radiology_Request_Details.objects.filter(OP_Register_Id_id=registration_id, RegisterType=RegisterType)
            elif RegisterType == "IP":
                registration_details = Patient_IP_Registration_Detials.objects.select_related('PatientId', 'PrimaryDoctor').get(Registration_Id=registration_id)
                radiology_requests = Radiology_Request_Details.objects.filter(IP_Register_Id=registration_id, RegisterType=RegisterType)
            elif RegisterType == "Casuality":
                registration_details = Patient_Casuality_Registration_Detials.objects.select_related('PatientId', 'PrimaryDoctor').get(pk=registration_id)
                radiology_requests = Radiology_Request_Details.objects.filter(Casuality_Register_Id_id=registration_id, RegisterType=RegisterType)
            elif RegisterType == "ExternalRadiology":
                registration_details = Patient_Diagnosis_Registration_Detials.objects.select_related('PatientId', 'PrimaryDoctor').get(pk=registration_id)
                radiology_requests = Radiology_Request_Details.objects.filter(Diagnosis_Register_Id_id=registration_id, RegisterType=RegisterType)
            else:
                return JsonResponse({'warn': 'Invalid RegisterType'}, status=400)
            
            # Extract patient and doctor details
            patient_id = registration_details.PatientId.PatientId
            patient_name = f"{registration_details.PatientId.FirstName} {registration_details.PatientId.MiddleName} {registration_details.PatientId.SurName}"
            phone_number = registration_details.PatientId.PhoneNo
            doctor_id = registration_details.PrimaryDoctor.Doctor_ID if registration_details.PrimaryDoctor else None
            doctor_name = f"{registration_details.PrimaryDoctor.First_Name} {registration_details.PrimaryDoctor.Last_Name}" if registration_details.PrimaryDoctor else None
            doctor_shortname = registration_details.PrimaryDoctor.ShortName if registration_details.PrimaryDoctor else None
            
            if RegisterType == "OP":
                radiology_requests = Radiology_Request_Details.objects.filter(OP_Register_Id=registration_id, RegisterType=RegisterType, Status='Request')
            elif RegisterType == "IP":
                radiology_requests = Radiology_Request_Details.objects.filter(IP_Register_Id=registration_id, RegisterType=RegisterType, Status='Request')
            elif RegisterType == "Casuality":
                radiology_requests = Radiology_Request_Details.objects.filter(Casuality_Register_Id=registration_id, RegisterType=RegisterType, Status='Request')
            elif RegisterType == "ExternalRadiology":
                radiology_requests = Radiology_Request_Details.objects.filter(Diagnosis_Register_Id=registration_id, RegisterType=RegisterType, Status='Request')
                
                

            
     
            response_data_no = []
            index = 1
            indexx = 1
            
            for req in radiology_requests:
               
                    # Fetch related TestName_Details and RadiologyNames_Details
                    testname = TestName_Details.objects.filter(Test_Code=req.SubTestCode).first()
                    radiologyname = RadiologyNames_Details.objects.filter(Radiology_Id=req.TestCode).first()
                    
                    
                    if radiologyname and testname:
                        response_data_no.append({
                            'id': index,
                            'PatientId': patient_id,
                            'Radiology_RequestId': req.Radiology_RequestId, 
                            'PatientName': patient_name,
                            'PhoneNumber': phone_number,
                            'DoctorId': doctor_id,
                            'DoctorName': doctor_name,
                            'DoctorShortName': doctor_shortname,
                            'Radiologyid': radiologyname.Radiology_Id,
                            'RadiologyName': radiologyname.Radiology_Name,
                            'TestCode': testname.Test_Code,
                            'TestName': testname.Test_Name,
                            'ChooseFile':get_file_image(testname.Report_file),
                            'Amount': testname.Amount,
                            'BookingFees':testname.BookingFees,
                        })
                        index += 1
                
                
            # Return both lists in the response
            return JsonResponse({
                'IsSubTestNo': response_data_no
            }, safe=False)
                    
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

        return JsonResponse({'error': 'Method not allowed'}, status=405)







@csrf_exempt
@require_http_methods(["GET"])
def Lab_Queuelist_link(request):
    try:
        query = request.GET.get('query', '')
        status = request.GET.get('status', '')

        # Fetch all Lab_Request_Details
        queryset = Lab_Request_Details.objects.all()
  
        # Apply filters based on the query parameters
        if query:
            queryset = queryset.filter(
                Q(OP_Register_Id__PatientId__FirstName__icontains=query) |
                Q(OP_Register_Id__PatientId__MiddleName__icontains=query) |
                Q(OP_Register_Id__PatientId__SurName__icontains=query) |
                Q(OP_Register_Id__PatientId__PatientId__icontains=query) |
                Q(OP_Register_Id__PatientId__PhoneNo__icontains=query) |
                Q(IP_Register_Id__PatientId__FirstName__icontains=query) |
                Q(IP_Register_Id__PatientId__MiddleName__icontains=query) |
                Q(IP_Register_Id__PatientId__SurName__icontains=query) |
                Q(IP_Register_Id__PatientId__PatientId__icontains=query) |
                Q(IP_Register_Id__PatientId__PhoneNo__icontains=query) |
                Q(Casuality_Register_Id__PatientId__FirstName__icontains=query) |
                Q(Casuality_Register_Id__PatientId__MiddleName__icontains=query) |
                Q(Casuality_Register_Id__PatientId__SurName__icontains=query) |
                Q(Casuality_Register_Id__PatientId__PatientId__icontains=query) |
                Q(Casuality_Register_Id__PatientId__PhoneNo__icontains=query) |
                Q(Laboratory_Register_Id__PatientId__FirstName__icontains=query) |
                Q(Laboratory_Register_Id__PatientId__MiddleName__icontains=query) |
                Q(Laboratory_Register_Id__PatientId__SurName__icontains=query) |
                Q(Laboratory_Register_Id__PatientId__PatientId__icontains=query) |
                Q(Laboratory_Register_Id__PatientId__PhoneNo__icontains=query)
            )

        print('22222222222',queryset)

        if status:
            queryset = queryset.filter(Q(Status__icontains=status))

        response_data = []
        seen_registration_ids = set()
        index = 1

        for lab_request in queryset:
            registration_details = None
            if lab_request.RegisterType == "OP":
                registration_details = lab_request.OP_Register_Id
                print('3333333',registration_details)
            elif lab_request.RegisterType == "IP":
                registration_details = lab_request.IP_Register_Id
            elif lab_request.RegisterType == "Casuality":
                registration_details = lab_request.Casuality_Register_Id
            elif lab_request.RegisterType == "ExternalLab":
                registration_details = lab_request.Laboratory_Register_Id

            if not registration_details:
                continue

            # Determine registration ID based on RegisterType
            if lab_request.RegisterType == "OP":
                registration_id = registration_details.id
                print('44444444',registration_id)
            elif lab_request.RegisterType == "IP":
                registration_id = registration_details.Registration_Id
            elif lab_request.RegisterType == "Casuality":
                registration_id = registration_details.id
            elif lab_request.RegisterType == "ExternalLab":
                registration_id = registration_details.id
                print('exxxxxxxx',registration_id)
            else:
                continue

            # Skip if we've already seen this registration ID
            if registration_id in seen_registration_ids:
                continue

            # Add registration ID to the set
            seen_registration_ids.add(registration_id)

            # Extract patient and doctor details
            patient_id = registration_details.PatientId.PatientId
            patient_name = f"{registration_details.PatientId.Title}. {registration_details.PatientId.FirstName} {registration_details.PatientId.MiddleName} {registration_details.PatientId.SurName}"
            phone_number = registration_details.PatientId.PhoneNo
            doctor_shortname = registration_details.PrimaryDoctor.ShortName if registration_details.PrimaryDoctor else None
            doctor_id = registration_details.PrimaryDoctor.Doctor_ID if registration_details.PrimaryDoctor else None
            print('5555555555',patient_id)

            response_data.append({
                'id': index,
                'PatientId': patient_id,
                'VisitId': registration_details.VisitId,
                'RegistrationId': registration_id,
                'PatientName': patient_name,
                'PhoneNumber': phone_number,
                'DoctorId': doctor_id,
                'DoctorShortName': doctor_shortname,
                'Specilization': str(registration_details.Specialization.Speciality_Name) if registration_details.Specialization else '',
                'RegisterType': lab_request.RegisterType, 
                'Status':lab_request.Status
            })
            index += 1

        return JsonResponse(response_data, safe=False)

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'Internal server error'}, status=500)





@csrf_exempt
@require_http_methods(["GET"])
def Lab_Request_TestDetails(request):
    try:
        registration_id = request.GET.get('Register_Id')
        patient_id = request.GET.get('Patient_Id')
        register_type = request.GET.get('RegisterType')
        status = request.GET.get('Status', "Request")

        # Validate required parameters
        if not registration_id or not patient_id or not register_type:
            return JsonResponse({'warn': 'Missing registration ID, patient ID, or RegisterType'}, status=400)

        # Get patient details
        try:
            patient_details = Patient_Detials.objects.get(PatientId=patient_id)
            patient_age = patient_details.Age
            patient_gender = patient_details.Gender
        except Patient_Detials.DoesNotExist:
            return JsonResponse({'warn': 'Patient ID not found'}, status=404)

        # Fetch lab requests based on registration type
        if register_type == "OP":
            lab_requests = Lab_Request_Details.objects.filter(OP_Register_Id=registration_id, RegisterType=register_type, Status=status)
        elif register_type == "IP":
            lab_requests = Lab_Request_Details.objects.filter(IP_Register_Id=registration_id, RegisterType=register_type, Status=status)
        elif register_type == "Casuality":
            lab_requests = Lab_Request_Details.objects.filter(Casuality_Register_Id=registration_id, RegisterType=register_type, Status=status)
        elif register_type == "ExternalLab":
            lab_requests = Lab_Request_Details.objects.filter(Laboratory_Register_Id=registration_id, RegisterType=register_type, Status=status)
        else:
            return JsonResponse({'warn': 'Invalid RegisterType'}, status=400)

        individual_requests = []
        favourites_requests = []
        all_test_details = []
        individual_index = 1
        favourites_index = 1
        all_details_index = 1  # Initialize index for all_test_details

        # Iterate over lab requests
        for lab_request in lab_requests:
                test_name = LabTestName_Details.objects.filter(TestCode=lab_request.IndivitualCode_id).last()

                if test_name:
                    lab_info = []  # List to hold lab name and outsource id
                    if test_name.Types == "Yes":
                        external_lab_details = External_LabAmount_Details.objects.filter(Test_Name=test_name)
                        for external_lab in external_lab_details:
                            lab_info.append({
                                'outsourceid': external_lab.OutSource_Id,
                                'labname': external_lab.OutSourceLabName.LabName,
                                'labAmount':external_lab.OutSourceLabAmount
                            })

                    individual_request = {
                        'Id': individual_index,
                        'TestType': lab_request.TestType,
                        'TestCode': lab_request.IndivitualCode.TestCode,
                        'TestName': test_name.Test_Name,
                        'Types': test_name.Types,
                        'OutSourceType': test_name.Types,
                        'Amount': test_name.Amount,
                        'LabInfo': lab_info  # Updated to include lab info
                    }
                    individual_requests.append(individual_request)
                    individual_index += 1

                    # Add to all_test_details with index
                    all_test_details.append({
                        'Id': all_details_index,  # Add index here
                        'TestCode': lab_request.IndivitualCode.TestCode,
                        'TestName': test_name.Test_Name,
                        'Amount': test_name.Amount,
                        'Types': test_name.Types,
                        'OutSourceType': test_name.Types,
                        'LabInfo': lab_info,  # Updated to include lab info
                    })
                    all_details_index += 1  # Increment index for all_test_details

           
        response = {
            'PatientAge': patient_age,
            'PatientGender': patient_gender,
            'IndividualRequests': individual_requests,
            'AllTestDetails': all_test_details,
        }

        return JsonResponse(response, safe=False)

    except Exception as e:
        print(f"Internal server error: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)



@csrf_exempt
@require_http_methods(["POST", "GET", "OPTIONS"])
def Lab_SelectedTest_Detailslink(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print("Received data:", data)
            
            individual_arr = data.get('IndividualArr', [])
            unchecked_arr = data.get('uncheckedTestsArr', [])
            created_by = data.get('created_by', '')
            registration_id = data.get('RegistrationId')
            print("registration_id:", registration_id)
            RegisterType = data.get('RegisterType')
            print("RegisterType:", RegisterType)

            # Validate input
            if not registration_id:
                return JsonResponse({'error': 'Missing registration ID'}, status=400)
            if not RegisterType:
                return JsonResponse({'error': 'Missing RegisterType'}, status=400)

            # Fetch the appropriate registration instance based on RegisterType
            registration_instance = None
            if RegisterType == "OP":
                registration_instance = Patient_Appointment_Registration_Detials.objects.filter(pk=registration_id).first()
            elif RegisterType == "IP":
                registration_instance = Patient_IP_Registration_Detials.objects.filter(pk=registration_id).first()
            elif RegisterType == "Casuality":
                registration_instance = Patient_Casuality_Registration_Detials.objects.filter(pk=registration_id).first()
            elif RegisterType == "ExternalLab":
                registration_instance = Patient_Laboratory_Registration_Detials.objects.filter(pk=registration_id).first()
                print("registration_instance Complaint:", registration_instance.Complaint if registration_instance else "Not found")
                print("123",registration_instance)

            # Check if registration instance is found
            if not registration_instance:
                return JsonResponse({'error': f'Invalid registration ID or RegisterType: {RegisterType}'})

            # Save individual tests
            for individual in individual_arr:
                test_code = individual.get('testCode', '')
                outsource_labname = individual.get('labname', '')
                testtype = "Yes" if outsource_labname else "No"
                try:
                    amount = int(individual.get('amount', 0))
                except ValueError:
                    return JsonResponse({'error': 'Invalid amount value'}, status=400)

                if amount > 0:
                    try:
                        test_code_ins = LabTestName_Details.objects.get(TestCode=test_code)
                        if outsource_labname:
                            outsource_labname_ins = External_LabAmount_Details.objects.get(OutSource_Id=outsource_labname)
                        else:
                            outsource_labname_ins = None
                    except (LabTestName_Details.DoesNotExist, External_LabAmount_Details.DoesNotExist) as e:
                        return JsonResponse({'error': str(e)}, status=400)

                    # Save test details
                    Lab_Request_Selected_Details.objects.create(
                        RegisterType=RegisterType,
                        OP_Register_Id=registration_instance if RegisterType == "OP" else None,
                        IP_Register_Id=registration_instance if RegisterType == "IP" else None,
                        Casuality_Register_Id=registration_instance if RegisterType == "Casuality" else None,
                        Laboratory_Register_Id=registration_instance if RegisterType == "ExternalLab" else None,
                        TestType=testtype,
                        IndivitualCode=test_code_ins,
                        OutSource_Name=outsource_labname_ins,
                        Amount=amount,
                        created_by=created_by,
                    )

                    # Update Lab_Request_Details status
                    if RegisterType == "ExternalLab":
                        Laboratory = "Laboratory"
                        
                        related_request = Lab_Request_Details.objects.filter(
                            **{f"{Laboratory}_Register_Id": registration_id, 'IndivitualCode': test_code}
                        ).last()
                    else:
                          related_request = Lab_Request_Details.objects.filter(
                            **{f"{RegisterType}_Register_Id": registration_id, 'IndivitualCode': test_code}
                        ).last()
                        

                    if related_request and not related_request.Reason:
                        related_request.Status = 'Completed'
                        related_request.save()

            # Update status for unchecked tests
            for test in unchecked_arr:
                test_code = test.get('testCode', '')
                reason = test.get('reason', '')

                if test_code:
        # Check if the RegisterType is "ExternalLab"
                    if RegisterType == "ExternalLab":
                        related_request = Lab_Request_Details.objects.filter(
                            Laboratory_Register_Id=registration_id, IndivitualCode=test_code
                        ).last()
                    else:
                        related_request = Lab_Request_Details.objects.filter(
                            **{f"{RegisterType}_Register_Id": registration_id, 'IndivitualCode': test_code}
                        ).last()

                    if related_request:
                        related_request.Status = 'Cancelled'
                        related_request.Reason = reason
                        related_request.save()

            return JsonResponse({'success': 'Data saved successfully'}, status=200)

        except Exception as e:
            print("Exception occurred:", e)
            return JsonResponse({'error': 'An internal server error occurred', 'details': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["GET"])
def Radiology_Queuelist_link(request):
    try:
        query = request.GET.get('query', '')
        status = request.GET.get('status', '')
        queryset = Radiology_Request_Details.objects.all()

        # Filter based on query parameter
        if query:
            queryset = queryset.filter(
                Q(OP_Register_Id__PatientId__FirstName__icontains=query) |
                Q(OP_Register_Id__PatientId__MiddleName__icontains=query) |
                Q(OP_Register_Id__PatientId__SurName__icontains=query) |
                Q(OP_Register_Id__PatientId__PatientId__icontains=query) |
                Q(OP_Register_Id__PatientId__PhoneNo__icontains=query) |
                Q(IP_Register_Id__PatientId__FirstName__icontains=query) |
                Q(IP_Register_Id__PatientId__MiddleName__icontains=query) |
                Q(IP_Register_Id__PatientId__SurName__icontains=query) |
                Q(IP_Register_Id__PatientId__PatientId__icontains=query) |
                Q(IP_Register_Id__PatientId__PhoneNo__icontains=query) |
                Q(Casuality_Register_Id__PatientId__FirstName__icontains=query) |
                Q(Casuality_Register_Id__PatientId__MiddleName__icontains=query) |
                Q(Casuality_Register_Id__PatientId__SurName__icontains=query) |
                Q(Casuality_Register_Id__PatientId__PatientId__icontains=query) |
                Q(Casuality_Register_Id__PatientId__PhoneNo__icontains=query) |
                Q(Diagnosis_Register_Id__PatientId__FirstName__icontains=query) |
                Q(Diagnosis_Register_Id__PatientId__MiddleName__icontains=query) |
                Q(Diagnosis_Register_Id__PatientId__SurName__icontains=query) |
                Q(Diagnosis_Register_Id__PatientId__PatientId__icontains=query) |
                Q(Diagnosis_Register_Id__PatientId__PhoneNo__icontains=query)
            )

        # Filter by status if provided
        if status:
            queryset = queryset.filter(Q(Status__icontains=status))

        response_data = []
        seen_registration_ids = set()  # Set to track unique registration IDs
        index = 1  # Initialize index

        for radiology_request in queryset:
            registration_id = None
            registration_details = None

            # Determine which registration ID and details to use based on RegisterType
            if radiology_request.RegisterType == 'OP' and radiology_request.OP_Register_Id:
                registration_id = radiology_request.OP_Register_Id.pk
                registration_details = radiology_request.OP_Register_Id
            elif radiology_request.RegisterType == 'IP' and radiology_request.IP_Register_Id:
                registration_id = radiology_request.IP_Register_Id.Registration_Id
                registration_details = radiology_request.IP_Register_Id
            elif radiology_request.RegisterType == 'Casuality' and radiology_request.Casuality_Register_Id:
                registration_id = radiology_request.Casuality_Register_Id.Registration_Id
                registration_details = radiology_request.Casuality_Register_Id
            elif radiology_request.RegisterType == "ExternalRadiology" and radiology_request.Diagnosis_Register_Id:
                registration_id = radiology_request.Diagnosis_Register_Id.pk  # Added to ensure registration_id is set
                registration_details = radiology_request.Diagnosis_Register_Id

            # Skip if the registration_id is not set or if already processed
            if not registration_id or registration_id in seen_registration_ids:
                continue

            # Add registration ID to the set to avoid duplicates
            seen_registration_ids.add(registration_id)

            # Extract patient and doctor details, handling None gracefully
            patient = registration_details.PatientId
            doctor = registration_details.PrimaryDoctor if registration_details.PrimaryDoctor else None

            patient_id = patient.PatientId if patient else None
            patient_age = patient.Age if patient else None
            patient_gender = patient.Gender if patient else None
            patient_name = f"{patient.FirstName or ''} {patient.MiddleName or ''} {patient.SurName or ''}".strip() if patient else None
            phone_number = patient.PhoneNo if patient else None
            doctor_id = doctor.Doctor_ID if doctor else None
            doctor_shortname = doctor.ShortName if doctor else None

            # Add the collected data to the response
            response_data.append({
                'id': index,
                'PatientId': patient_id,
                'VisitId': registration_details.VisitId,
                'RegistrationId': registration_id,
                'PatientName': patient_name,
                'PhoneNumber': phone_number,
                'DoctorId': doctor_id,
                'DoctorShortName': doctor_shortname,
                'RegisterType': radiology_request.RegisterType,
                'age': patient_age,
                'gender': patient_gender,
                'Status': radiology_request.Status
            })

            # Increment index
            index += 1

        # Return the collected data as a JSON response
        return JsonResponse(response_data, safe=False)

    except Exception as e:
        print("Exception:", e)
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)



@csrf_exempt
@require_http_methods(["GET"])
def Lab_ViewStatus_link(request):
    try:
        registration_id = request.GET.get('RegistrationId')
        status = request.GET.get('status', '')
        register_type = request.GET.get('RegisterType', '')

        if not registration_id:
            return JsonResponse({'warn': 'RegistrationId is required'})

        # Validate RegisterType
        if register_type not in ['OP', 'IP', 'Casuality', 'ExternalLab']:
            return JsonResponse({'warn': 'Invalid RegisterType'})

        # Adjust the queryset based on RegisterType
        queryset_filter = Q()
        if register_type == "IP":
            queryset_filter = Q(IP_Register_Id=registration_id)
        elif register_type == "OP":
            queryset_filter = Q(OP_Register_Id=registration_id)
        elif register_type == "Casuality":
            queryset_filter = Q(Casuality_Register_Id=registration_id)
        elif register_type == "ExternalLab":
            queryset_filter = Q(Laboratory_Register_Id=registration_id)
            

        queryset = Lab_Request_Details.objects.filter(
            queryset_filter & Q(Status=status) & Q(RegisterType=register_type)
        )

        # Initialize lists to store individual and favourite test details
        individual_requests = []
        favourites_requests = []
        all_test_details = []

        individual_index = 1  # Initialize index for individual tests
        all_details_index = 1  # Initialize a universal index for all test details

        for lab_request in queryset:
            test_name = LabTestName_Details.objects.filter(TestCode=lab_request.IndivitualCode_id).last()
            print("test_name", test_name)
            if test_name:
                lab_info = []  # List to hold lab name and outsource id
                if test_name.Types == "Yes":
                    external_lab_details = External_LabAmount_Details.objects.filter(Test_Name=test_name)
                    for external_lab in external_lab_details:
                        lab_info.append({
                            'outsourceid': external_lab.OutSource_Id,
                            'labname': external_lab.OutSourceLabName.LabName,
                            'labAmount': external_lab.OutSourceLabAmount
                        })

                individual_request = {
                    'id': individual_index,
                    'TestType': lab_request.TestType,
                    'TestCode': lab_request.IndivitualCode.TestCode,
                    'TestName': test_name.Test_Name,
                    'Types': test_name.Types,
                    'OutSourceType': test_name.Types,
                    'Amount': test_name.Amount,
                    'LabInfo': lab_info  # Updated to include lab info
                }

                # Add Reason field if status is 'Cancelled'
                if lab_request.Status == 'Cancelled':
                    individual_request['Reason'] = lab_request.Reason

                individual_requests.append(individual_request)
                individual_index += 1

                # Add to all_test_details with index
                all_test_details.append({
                    'id': all_details_index,  # Add index here
                    'TestCode': lab_request.IndivitualCode.TestCode,
                    'TestName': test_name.Test_Name,
                    'Amount': test_name.Amount,
                    'Types': test_name.Types,
                    'OutSourceType': test_name.Types,
                    'LabInfo': lab_info,  # Updated to include lab info
                })

                # Add Reason to all_test_details if status is 'Cancelled'
                if lab_request.Status == 'Cancelled':
                    all_test_details[-1]['Reason'] = lab_request.Reason

                all_details_index += 1  # Increment index for all_test_details

        response = {
            'IndividualRequests': individual_requests,
            'AllTestDetails': all_test_details,
        }

        return JsonResponse(response, safe=False)

    except Exception as e:
        # Log the error to the console or logs for debugging
        print(f"Error occurred: {str(e)}")
        return JsonResponse({'error': 'Internal server error'}, status=500)


# lab completedqueue 
@csrf_exempt
@require_http_methods(["GET"])
def Lab_completed_quelist(request):
    try:
        # Get the 'status' parameter from the request
        status = request.GET.get('status', 'Pending')
        query = request.GET.get('query', '')

        # Filter queryset to include records with RegisterType 'OP' or 'IP'
        queryset = Lab_Request_Selected_Details.objects.filter(
            Q(RegisterType='OP') | Q(RegisterType='IP')
        )

        # Apply additional status filtering if provided
        if status:
            queryset = queryset.filter(Q(Status__icontains=status))

        response_data = []
        seen_registration_ids = set()
        index = 1

        for lab_complete in queryset:
            # Determine registration ID based on RegisterType
            if lab_complete.RegisterType == 'OP':
                registration_id = lab_complete.OP_Register_Id.pk
                registration_details = lab_complete.OP_Register_Id
            else:
                registration_id = lab_complete.IP_Register_Id.Registration_Id
                registration_details = lab_complete.IP_Register_Id

            # Avoid duplicate entries based on registration ID
            if registration_id in seen_registration_ids:
                continue
            seen_registration_ids.add(registration_id)

            patient = registration_details.PatientId
            patient_name = f"{patient.Title}. {patient.FirstName} {patient.MiddleName} {patient.SurName}".strip()
            phone_number = patient.PhoneNo
            doctor = registration_details.PrimaryDoctor
            doctor_shortname = doctor.ShortName if doctor else None
            doctor_id = doctor.Doctor_ID if doctor else None
            specialization_name = registration_details.Specialization.Speciality_Name if registration_details.Specialization else ''
            
            response_data.append({
                'id': index,
                'PatientId': patient.PatientId,
                'VisitId': registration_details.VisitId,
                'RegistrationId': registration_id,
                'PatientName': patient_name,
                'PhoneNumber': phone_number,
                'DoctorId': doctor_id,
                'DoctorShortName': doctor_shortname,
                'Specialization': str(specialization_name),
                # 'CategoryType': lab_complete.CategoryType,
                'Status': lab_complete.Status,
                'RegisterType': lab_complete.RegisterType
            })
            index += 1

        return JsonResponse(response_data, safe=False)
    
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)




@csrf_exempt
@require_http_methods(["GET"])
def Lab_Complete_TestDetails(request):
    try:
        # Retrieve parameters from the request
        registration_id = request.GET.get('Register_Id')
        patient_id = request.GET.get('Patient_Id')
        status = request.GET.get('Status', 'Paid')
        print("status89",status)
        register_type = request.GET.get('RegisterType')
        print("register_type",register_type)

        # Validate required parameters
        if not all([registration_id, patient_id, register_type]):
            return JsonResponse({'warn': 'Missing registration ID, patient ID, or register type'})

        try:
            # Fetch patient details
            patient_details = Patient_Detials.objects.get(PatientId=patient_id)
            patient_age = patient_details.Age
            patient_gender = patient_details.Gender
        except Patient_Detials.DoesNotExist:
            return JsonResponse({'warn': 'Patient ID not found'})

        # Filter lab requests based on parameters
        if register_type == "OP":
            lab_completes = Lab_Request_Selected_Details.objects.filter(
                Q(OP_Register_Id=registration_id) &
                Q(Status=status) &
                Q(RegisterType=register_type)
            )
            print("lab_completes",lab_completes)
        elif register_type == "IP":
            lab_completes = Lab_Request_Selected_Details.objects.filter(
                Q(IP_Register_Id=registration_id) &
                Q(Status=status) &
                Q(RegisterType=register_type)
            )
        elif register_type == "Casuality":
            lab_completes = Lab_Request_Selected_Details.objects.filter(
                Q(Casuality_Register_Id=registration_id) &
                Q(Status=status) &
                Q(RegisterType=register_type)
            )
        else:
            return JsonResponse({'warn': 'Invalid RegisterType'}, status=400)

        individual_complete = []
        favourites_complete = []

        individual_index = 1
        favourites_index = 1

        for lab_complete in lab_completes:

            test_name = LabTestName_Details.objects.filter(IndivitualCode=lab_complete.Code).first()
            if test_name:
                individual_complete.append({
                    'Id': individual_index,
                    'TestType': lab_complete.TestType,
                    'TestName': test_name.Test_Name,
                    'TestCode': test_name.TestCode,
                    'CategoryType': lab_complete.RegisterType,
                })
                individual_index += 1

            else:
                favourite = TestName_Favourites.objects.filter(Favourite_Code=lab_complete.Code).first()
                if favourite:
                    # Add the favourite entry
                    favourites_complete.append({
                        'Id': favourites_index,
                        'FavouriteName': favourite.FavouriteName,
                        'FavouriteCode': favourite.Favourite_Code,
                        'TestCode': None,
                        'TestName': None,
                        'CategoryType': lab_complete.RegisterType,
                    })
                    favourites_index += 1

                    # Add entries for each test within the favourite
                    for test_index, test in enumerate(favourite.TestName.all(), start=1):
                        favourites_complete.append({
                            'Id': favourites_index,
                            'FavouriteName': None,
                            'FavouriteCode': None,
                            'TestCode': test.TestCode,
                            'TestName': test.Test_Name,
                            'CategoryType': lab_complete.CategoryType,
                        })
                        favourites_index += 1

        # Prepare the response data
        response = {
            'PatientAge': patient_age,
            'PatientGender': patient_gender,
            'IndividualRequests': individual_complete,
            'FavouritesRequests': favourites_complete,
        }

        return JsonResponse(response, safe=False)

    except Exception as e:
        return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)













@csrf_exempt
@require_http_methods(["POST", "GET", "OPTIONS"])
def Lab_PaidDetails_link(request):
    def validate_and_process_file(file):
        def get_file_type(file):
            if file.startswith('data:application/pdf;base64'):
                return 'application/pdf'
            elif file.startswith('data:image/jpeg;base64') or file.startswith('data:image/jpg;base64'):
                return 'image/jpeg'
            elif file.startswith('data:image/png;base64'):
                return 'image/png'
            else:
                return 'unknown'

        def compress_image(image, min_quality=10, step=5):
            output = BytesIO()
            quality = 95
            while quality >= min_quality:
                output.seek(0)
                image.save(output, format='JPEG', quality=quality)
                compressed_data = output.getvalue()
                quality -= step
            return compressed_data, len(compressed_data)

        def compress_pdf(file):
            output = BytesIO()
            reader = PdfReader(file)
            writer = PdfWriter()
            for page_num in range(len(reader.pages)):
                writer.add_page(reader.pages[page_num])
            writer.write(output)
            return output.getvalue(), len(output.getvalue())

        if file:
            try:
                file_data = file.split(',')[1]
                file_content = base64.b64decode(file_data)
                file_size = len(file_content)

                max_size_mb = 5
                if file_size > max_size_mb * 1024 * 1024:
                    return JsonResponse({'warn': f'File size exceeds the maximum allowed size ({max_size_mb}MB)'}, status=400)

                file_type = get_file_type(file)

                if file_type in ['image/jpeg', 'image/png']:
                    image = Image.open(BytesIO(file_content))
                    if image.mode in ('RGBA', 'P'):
                        image = image.convert('RGB')
                    compressed_image_data, _ = compress_image(image)
                    return compressed_image_data

                elif file_type == 'application/pdf':
                    compressed_pdf_data, _ = compress_pdf(BytesIO(file_content))
                    return compressed_pdf_data

                else:
                    return JsonResponse({'warn': 'Unsupported file format'}, status=400)

            except Exception as e:
                return JsonResponse({'error': f'Error processing file: {str(e)}'}, status=500)

        return None
     
     
    if request.method == 'POST':
        try:
            # Ensure the request body is not empty
            if not request.body:
                return JsonResponse({'warn': 'Request body is empty'}, status=400)

            # Parse JSON body
            data = request.POST
            
            RegistrationId = data.get('RegistrationId')
            RelativeName = data.get('RelativeName', '')
            ReportDate = data.get('ReportDate', '')
            ReportHandovered = data.get('ReportHandoOvered', '')
            ReportTime = data.get('ReportTime', '')
            TechnicianName = data.get('TechnicianName', '')
            created_by = data.get('created_by', '')
            ChooseFileOne = data.get('ChooseFile', '')
            RegisterType = data.get('RegisterType')
            FavArr = data.get('FavArr', [])
            checkarr = data.get('checkarr', [])

            fav_arr_list = json.loads(FavArr)
            check_arr_list = json.loads(checkarr)

            processed_files = {
                'ChooseFileOne': validate_and_process_file(ChooseFileOne) if ChooseFileOne else None,
            }

            # Check if any file processing returned an error response
            if any(isinstance(value, JsonResponse) for value in processed_files.values()):
                return next(value for value in processed_files.values() if isinstance(value, JsonResponse))

            if not RegistrationId:
                return JsonResponse({'warn': 'Missing Registration Id'}, status=400)

            # Save Lab_ReportEntry_Details only once
            registration_instance = None
            if RegisterType == "OP":
                registration_instance = Patient_Appointment_Registration_Detials.objects.filter(pk=RegistrationId).first()
            elif RegisterType == "IP":
                registration_instance = Patient_IP_Registration_Detials.objects.filter(pk=RegistrationId).first()
            elif RegisterType == "Casuality":
                registration_instance = Patient_Casuality_Registration_Detials.objects.filter(pk=RegistrationId).first()

            if not registration_instance:
                return JsonResponse({'warn': 'Invalid registration ID or RegisterType'}, status=400)

            lab_ins = Lab_ReportEntry_Details.objects.create(
                RegisterType=RegisterType,
                OP_Register_Id=registration_instance if RegisterType == "OP" else None,
                IP_Register_Id=registration_instance if RegisterType == "IP" else None,
                Casuality_Register_Id=registration_instance if RegisterType == "Casuality" else None,
                report_date=ReportDate,
                report_time=ReportTime,
                report_file=processed_files['ChooseFileOne'],
                technician_name=TechnicianName,
                report_handovered_by=ReportHandovered,
                report_handovered_to=RelativeName,
                created_by=created_by
            )

            # Save PaidTest_Indivitaul instances
            paid_test_instances = []
            for item in check_arr_list:
                test_code_instance = LabTestName_Details.objects.filter(TestCode=item.get('TestCode')).first()
                if test_code_instance:
                    paid_test_instances.append(
                        PaidTest_Indivitaul(
                            Registration_Id=lab_ins,
                            test_type=item.get('TestType', 'Individual'),
                            testCode=test_code_instance,  # Use the instance here
                            value=item.get('Values', ''),
                            category_type=item.get('CategoryType', ''),
                            description=item.get('Description', ''),
                            status='Completed' if item.get('Values', '') else 'Pending'
                        )
                    )
            if paid_test_instances:
                PaidTest_Indivitaul.objects.bulk_create(paid_test_instances)

            # Save PaidTest_Favourites instances
            fav_test_instances = []
            last_fav_code = ''
            last_category_type = ''
            for item in fav_arr_list:
                if isinstance(item, dict):
                    fav_code = item.get('FavouriteCode', '')
                    catogory_type = item.get('CategoryType', '')
                    
                    # Retrieve or continue with the last favCode and categoryType
                    if fav_code:
                        fav_code_instance = TestName_Favourites.objects.filter(Favourite_Code=fav_code).first()
                        last_fav_code = fav_code_instance if fav_code_instance else last_fav_code
                    if catogory_type:
                        last_category_type = catogory_type

                    if item.get('TestCode'):
                        test_code_instance = LabTestName_Details.objects.filter(TestCode=item.get('TestCode')).first()
                        if test_code_instance and last_fav_code:
                            fav_test_instances.append(
                                PaidTest_Favourites(
                                    Registration_Id=lab_ins,
                                    favCode=last_fav_code,  # Use the instance of favCode
                                    test_type="Favourites",
                                    category_type=last_category_type,
                                    testCode=test_code_instance,  # Use the instance of testCode
                                    value=item.get('Values', ''),
                                    description=item.get('Description', ''),
                                    status='Completed' if item.get('Values', '') else 'Pending'
                                )
                            )

            if fav_test_instances:
                PaidTest_Favourites.objects.bulk_create(fav_test_instances)

            return JsonResponse({'success': 'Data saved successfully'}, status=200)

        except Exception as e:
            print("Exception:", e)
            return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)

    return JsonResponse({'warn': 'Invalid request method'}, status=405)






@csrf_exempt
@require_http_methods(["GET"])
def lab_report_details_view(request):
    if request.method == 'GET':
        try:
            registration_id = request.GET.get('Register_Id')
            RegisterType = request.GET.get('RegisterType')

            # Check for missing parameters
            if not registration_id:
                return JsonResponse({'warn': 'Missing registration Id'}, status=400)
            if not RegisterType:
                return JsonResponse({'warn': 'Missing RegisterType'}, status=400)

            # Determine the lab report based on RegisterType
            lab_report = None
            if RegisterType == "OP":
                lab_report = Lab_ReportEntry_Details.objects.filter(OP_Register_Id_id=registration_id, RegisterType=RegisterType).last()
            elif RegisterType == "IP":
                lab_report = Lab_ReportEntry_Details.objects.filter(IP_Register_Id_id=registration_id, RegisterType=RegisterType).last()
            elif RegisterType == "Casuality":
                lab_report = Lab_ReportEntry_Details.objects.filter(Casuality_Register_Id_id=registration_id, RegisterType=RegisterType).last()

            # If no lab report is found
            if not lab_report:
                return JsonResponse({'warn': 'Lab report not found for the given Registration ID'}, status=404)

            # Helper function to convert file data to base64
            

            def get_file_image(filedata):
                try:
                    kind = filetype.guess(filedata)
                    
                    # Supported MIME types
                    supported_mime_types = [
                        'application/pdf',
                        'image/jpeg',
                        'image/png'
                    ]
                    
                    if kind and kind.mime in supported_mime_types:
                        contenttype = kind.mime
                    else:
                        contenttype = 'application/octet-stream'  # Default for unknown types
                    
                    # Return base64 encoded data with MIME type
                    return f'data:{contenttype};base64,{base64.b64encode(filedata).decode("utf-8")}'
                
                except Exception as e:
                    print(f"Error processing file: {e}")
                    return None


            # Construct response data
            response_data = {
                'lab_report_entry': {
                    'report_id': lab_report.report_id,
                    'registrationid': lab_report.OP_Register_Id_id if RegisterType == "OP" else 
                                      lab_report.IP_Register_Id_id if RegisterType == "IP" else
                                      lab_report.Casuality_Register_Id_id,
                    'report_date': lab_report.report_date,
                    'report_time': lab_report.report_time,
                    'reportfile': get_file_image(lab_report.report_file) if lab_report.report_file else None,
                    'technician_name': lab_report.technician_name,
                    'report_handovered_by': lab_report.report_handovered_by,
                    'report_handovered_to': lab_report.report_handovered_to,
                    'created_by': lab_report.created_by,
                    'status': lab_report.status
                },
                'individual_tests': [],
                'favourite_tests': []  # Placeholder for future favorite tests handling
            }

            # Get individual tests linked to the lab report
            individual_tests = PaidTest_Indivitaul.objects.filter(Registration_Id=lab_report.report_id)
            test_codes = [test.testCode_id for test in individual_tests]
            favourite_tests = PaidTest_Favourites.objects.filter(Registration_Id=lab_report.report_id)

            # Fetch test names for the test codes
            test_name_map = {
                test['TestCode']: test['Test_Name']
                for test in LabTestName_Details.objects.filter(TestCode__in=test_codes).values('TestCode', 'Test_Name')
            }

            # Add individual test details to the response
            for index, test in enumerate(individual_tests, start=1):
                test_name = test_name_map.get(test.testCode_id, 'Unknown Test')
                response_data['individual_tests'].append({
                    'id': index,
                    'testCode': test.testCode_id,
                    'test_type': str(test.test_type),
                    'test_name': test_name,
                    'value': test.value,
                    'category_type': str(test.category_type),
                    'description': test.description or '',
                    'status': str(test.status),
                })
            
            
               # Add favourite test details to the response
            for fav_test in favourite_tests:
                response_data['favourite_tests'].append({
                    'reportfav_id': fav_test.reportfav_id,
                    'favourite_name': fav_test.favCode.FavouriteName if fav_test.favCode else 'Unknown Favourite',
                    'test_name': fav_test.testCode.Test_Name if fav_test.testCode else 'Unknown Test',
                    'value': fav_test.value,
                    'category_type': str(fav_test.category_type),
                    'description': fav_test.description or '',
                    'status': str(fav_test.status),
                    'created_at': fav_test.created_at,
                    'updated_at': fav_test.updated_at,
                })
            # Return the response
            return JsonResponse(response_data, safe=False)

        except Exception as e:
            # Print full traceback to help debug
            # print(traceback.format_exc())
            return JsonResponse({'error': str(e)}, status=500)









@csrf_exempt
@require_http_methods(["GET"])
def OtRequest_Details(request):
    try:
        DoctorId = request.GET.get("DoctorId", None)
        Speciality = request.GET.get("Specialization", None)

        if not DoctorId or not Speciality:
            return JsonResponse({'warn': 'DoctorId and Specialization missing'})

        # Fetch doctor details
        doctor = Doctor_Personal_Form_Detials.objects.get(pk=DoctorId)

        # Fetch speciality details
        speciality = Speciality_Detials.objects.get(pk=Speciality)

        # Construct the full name of the doctor
        doctor_name = f"{doctor.Tittle} {doctor.First_Name} {doctor.Middle_Name} {doctor.Last_Name}".strip()

        return JsonResponse({
            'DoctorName': doctor_name,
            'SpecialityName': speciality.Speciality_Name
        })

    except Doctor_Personal_Form_Detials.DoesNotExist:
        return JsonResponse({'error': 'Doctor not found'}, status=404)
    except Speciality_Detials.DoesNotExist:
        return JsonResponse({'error': 'Specialization not found'}, status=404)
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'Internal Server Error'},status=500)






              
@csrf_exempt
@require_http_methods(["POST", "GET", "OPTIONS"])
def Radiology_Complete_Details_Link(request):
    def validate_and_process_file(file):
        def get_file_type(file):
            if file.startswith('data:application/pdf;base64'):
                return 'application/pdf'
            elif file.startswith('data:image/jpeg;base64') or file.startswith('data:image/jpg;base64'):
                return 'image/jpeg'
            elif file.startswith('data:image/png;base64'):
                return 'image/png'
            else:
                return 'unknown'

        def compress_image(image, min_quality=10, step=5):
            output = BytesIO()
            quality = 95
            while quality >= min_quality:
                output.seek(0)
                image.save(output, format='JPEG', quality=quality)
                compressed_data = output.getvalue()
                quality -= step
            return compressed_data, len(compressed_data)

        def compress_pdf(file):
            output = BytesIO()
            reader = PdfReader(file)
            writer = PdfWriter()
            for page_num in range(len(reader.pages)):
                writer.add_page(reader.pages[page_num])
            writer.write(output)
            return output.getvalue(), len(output.getvalue())

        if file:
            try:
                file_data = file.split(',')[1]
                file_content = base64.b64decode(file_data)
                file_size = len(file_content)

                max_size_mb = 5
                if file_size > max_size_mb * 1024 * 1024:
                    return JsonResponse({'warn': f'File size exceeds the maximum allowed size ({max_size_mb}MB)'}, status=400)

                file_type = get_file_type(file)

                if file_type in ['image/jpeg', 'image/png']:
                    image = Image.open(BytesIO(file_content))
                    if image.mode in ('RGBA', 'P'):
                        image = image.convert('RGB')
                    compressed_image_data, _ = compress_image(image)
                    return compressed_image_data

                elif file_type == 'application/pdf':
                    compressed_pdf_data, _ = compress_pdf(BytesIO(file_content))
                    return compressed_pdf_data

                else:
                    return JsonResponse({'warn': 'Unsupported file format'}, status=400)

            except Exception as e:
                return JsonResponse({'error': f'Error processing file: {str(e)}'}, status=500)

        return None

 
    if request.method == 'POST':
        try:
            if not request.body:
                return JsonResponse({'warn': 'Request body is empty'}, status=400)
            
            data = request.POST
            print("complete Radiology", data)
            RegistrationId = data.get('Registeration_Id', None)
            RegisterType = data.get('RegisterType', None)
            ReportDate = data.get('ReportDate', '')
            ReportTime = data.get('ReportTime', '')
            RadiologistName = data.get('RadiologistName', '')
            TechnicianName = data.get('TechnicianName', '')
            Report = data.get('Report', '')
            ReportHandoOvered = data.get('ReportHandoOvered', '')
            RelativeName = data.get('RelativeName', '')
            Radiology_RequestID = data.get('Radiology_RequestID', None)
            ChooseFileOne = data.get('ChooseFileOne', '')
            ChooseFileTwo = data.get('ChooseFileTwo', '')
            ChooseFileThree = data.get('ChooseFileThree', '')
            created_by = data.get('created_by', '')
            Radiology_CompleteId = data.get('Radiology_CompleteId','')
            
            # Correcting the typo in variable name
            processed_files = {
                'ChooseFileOne': validate_and_process_file(ChooseFileOne) if ChooseFileOne else None,
                'ChooseFileTwo': validate_and_process_file(ChooseFileTwo) if ChooseFileTwo else None,
                'ChooseFileThree': validate_and_process_file(ChooseFileThree) if ChooseFileThree else None,
            }
            
            if any(isinstance(value, JsonResponse) for value in processed_files.values()):
                return next(value for value in processed_files.values() if isinstance(value, JsonResponse))
            
            if not RegistrationId:
                return JsonResponse({'warn': 'Missing Registration Id'}, status=200)
            if not Radiology_RequestID:
                return JsonResponse({'warn': 'Missing Request Id'}, status=200)
            if not RegisterType:
                return JsonResponse({'warn': 'Missing RegisterType'}, status=200)
            
            # Fetching registration instance based on RegisterType
            registration_instance = None
            if RegisterType == "OP":
                registration_instance = Patient_Appointment_Registration_Detials.objects.filter(pk=RegistrationId).first()
            elif RegisterType == "IP":
                registration_instance = Patient_IP_Registration_Detials.objects.filter(pk=RegistrationId).first()
            elif RegisterType == "Casuality":
                registration_instance = Patient_Casuality_Registration_Detials.objects.filter(pk=RegistrationId).first()
            
            if not registration_instance:
                return JsonResponse({'warn': 'Invalid registration ID or RegisterType'})
            
            Radiology_Request_ins = Radiology_Request_Details.objects.filter(pk=Radiology_RequestID).first()
            
            # If Radiology_CompleteId exists, update the entry
            if Radiology_CompleteId:
                try:
                    Radiology_Complete_ins = Radiology_Complete_Details.objects.get(pk=Radiology_CompleteId)
                except Radiology_Complete_Details.DoesNotExist:
                    return JsonResponse({'warn': 'RadiologyTest not found'}, status=404)
                
                # Updating fields
                Radiology_Complete_ins.Radiology_CompleteId = Radiology_CompleteId
                Radiology_Complete_ins.RegisterType = RegisterType
                Radiology_Complete_ins.OP_Register_Id = registration_instance if RegisterType == "OP" else None
                Radiology_Complete_ins.IP_Register_Id = registration_instance if RegisterType == "IP" else None
                Radiology_Complete_ins.Casuality_Register_Id = registration_instance if RegisterType == "Casuality" else None
                Radiology_Complete_ins.Radiology_RequestId = Radiology_Request_ins
                Radiology_Complete_ins.ReportDate = ReportDate
                Radiology_Complete_ins.ReportTime = ReportTime
                Radiology_Complete_ins.RadiologistName = RadiologistName
                Radiology_Complete_ins.Technician_Name = TechnicianName
                Radiology_Complete_ins.Report = Report
                Radiology_Complete_ins.Report_fileone = processed_files['ChooseFileOne']
                Radiology_Complete_ins.Report_filetwo = processed_files['ChooseFileTwo']
                Radiology_Complete_ins.Report_filethree = processed_files['ChooseFileThree']
                Radiology_Complete_ins.Report_HandOverTo = ReportHandoOvered
                Radiology_Complete_ins.RelativeName = RelativeName
                Radiology_Complete_ins.save()
                return JsonResponse({'success': 'Report Entry Updated successfully'}, status=200)
            
            # Else, create a new Radiology Complete entry
            else:
                Radiology_Complete_ins = Radiology_Complete_Details.objects.create(
                    RegisterType=RegisterType,
                    OP_Register_Id=registration_instance if RegisterType == "OP" else None,
                    IP_Register_Id=registration_instance if RegisterType == "IP" else None,
                    Casuality_Register_Id=registration_instance if RegisterType == "Casuality" else None,
                    Radiology_RequestId=Radiology_Request_ins,
                    ReportDate=ReportDate,
                    ReportTime=ReportTime,
                    RadiologistName=RadiologistName,
                    Technician_Name=TechnicianName,
                    Report=Report,
                    Report_fileone=processed_files['ChooseFileOne'],
                    Report_filetwo=processed_files['ChooseFileTwo'],
                    Report_filethree=processed_files['ChooseFileThree'],
                    Report_HandOverTo=ReportHandoOvered,
                    RelativeName=RelativeName,
                    Createdby=created_by
                )
                Radiology_Request_ins.Status = "Completed"
                Radiology_Request_ins.save()
                return JsonResponse({'success': 'Report Entry Saved successfully'}, status=200)
        
        except Exception as e:
            print("Exception:", e)
            return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)

    elif request.method == 'GET':
        try:
            registration_id = request.GET.get('Register_Id', None)
            RegisterType = request.GET.get('RegisterType', None)

            if registration_id is None or RegisterType is None:
                return JsonResponse({'warn': 'Missing Registration Id or RegisterType'}, status=400)

            # Fetch registration details and corresponding radiology requests
            if RegisterType == "OP":
                registration_details = Patient_Appointment_Registration_Detials.objects.select_related('PatientId', 'PrimaryDoctor').get(pk=registration_id)
                radiology_requests = Radiology_Complete_Details.objects.filter(OP_Register_Id=registration_id, RegisterType=RegisterType)
            elif RegisterType == "IP":
                registration_details = Patient_IP_Registration_Detials.objects.select_related('PatientId', 'PrimaryDoctor').get(Registration_Id=registration_id)
                radiology_requests = Radiology_Complete_Details.objects.filter(IP_Register_Id=registration_id, RegisterType=RegisterType)
            elif RegisterType == "Casuality":
                registration_details = Patient_Casuality_Registration_Detials.objects.select_related('PatientId', 'PrimaryDoctor').get(pk=registration_id)
                radiology_requests = Radiology_Complete_Details.objects.filter(Casuality_Register_Id=registration_id, RegisterType=RegisterType)
            else:
                return JsonResponse({'warn': 'Invalid RegisterType'}, status=400)

            # Function to encode files
          

            def get_file_image(filedata):
                try:
                    kind = filetype.guess(filedata)
                    
                    # Supported MIME types
                    supported_mime_types = [
                        'application/pdf',
                        'image/jpeg',
                        'image/png'
                    ]
                    
                    if kind and kind.mime in supported_mime_types:
                        contenttype = kind.mime
                    else:
                        contenttype = 'application/octet-stream'  # Default for unknown types
                    
                    # Return base64 encoded data with MIME type
                    return f'data:{contenttype};base64,{base64.b64encode(filedata).decode("utf-8")}'
                
                except Exception as e:
                    print(f"Error processing file: {e}")
                    return None


            # Prepare response data
            response_data = []
            for index, req in enumerate(radiology_requests, start=1):
                # Fetch the required names based on IsSubTest
                test_code = req.Radiology_RequestId.TestCode
                subtest_code = req.Radiology_RequestId.SubTestCode
                radiology_id = None
                radiology_name = None
                if req.Radiology_RequestId.IsSubTest == 'Yes':
                    testname = TestName_Details.objects.get(Test_Code=test_code)
                    subtestname = SubTest_Details.objects.get(SubTest_Code=subtest_code)
                    radiology_id = testname.Radiology_Id
                    radiology_name = radiology_id.Radiology_Name if radiology_id else None
                else:  # If IsSubTest is 'No'
                    testname = TestName_Details.objects.get(Test_Code=subtest_code)
                    subtestname = None
                    radiology_name_obj = RadiologyNames_Details.objects.get(Radiology_Id=test_code)
                    radiology_name = radiology_name_obj.Radiology_Name if radiology_name_obj else None
                                

                            
                
                current_month = datetime.now()
                # formatted_date = current_month.strftime("%d-%m-%Y")
                formatted_date = current_month.strftime("%Y-%m-%d")
                report_date = None
                if isinstance(req.ReportDate, str) and req.ReportDate:
                    try:
                        report_date = datetime.fromisoformat(req.ReportDate).strftime('%d-%m-%Y')
                    except ValueError:
                        print(f"Invalid ReportDate format: {req.ReportDate}")  # Debug print

    # Format ReportTime
                report_time = None
                if isinstance(req.ReportTime, str) and req.ReportTime:
                    try:
                        report_time = datetime.fromisoformat(req.ReportTime).strftime('%H:%M')
                    except ValueError:
                        print(f"Invalid ReportTime format: {req.ReportTime}")  # Debug print
                response_data.append({
                    'id': index,
                    'ReportDate': report_date if report_date else formatted_date,
                    'ReportTime': report_time if report_time else current_month.strftime('%H:%M'),
                    'RadiologistName': req.RadiologistName,
                    'TechnicianName': req.Technician_Name,
                    'TestCode': test_code,  # Add TestCode
                    'SubTestCode': subtest_code, 
                    'Radiology_RequestId': req.Radiology_RequestId.pk,  # Add Radiology_RequestId
                    'Radiology_CompleteId': req.pk,
                    'Report': req.Report,
                    'IsSubTest':req.Radiology_RequestId.IsSubTest,
                    'RadiologyName': radiology_name,
                    'TestName': testname.Test_Name if testname else None,
                    'SubTestName': subtestname.SubTestName if subtestname else None,
                    'RadiologyId': radiology_id.Radiology_Id if radiology_id else None,
                    'Report_fileone': get_file_image(req.Report_fileone) if req.Report_fileone else None,
                    'Report_filetwo': get_file_image(req.Report_filetwo) if req.Report_filetwo else None,
                    'Report_filethree': get_file_image(req.Report_filethree) if req.Report_filethree else None,
                    'Report_HandOverTo': req.Report_HandOverTo,
                    'RelativeName': req.RelativeName,
                    'Createdby': req.Createdby,
                    'Status': req.Status,
                })

            # Return the response
            return JsonResponse(response_data,  safe=False)


        except Exception as e:
            print(f"Exception: {e}")
            return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)

    return JsonResponse({'warn': 'Invalid request method'}, status=405)

    








