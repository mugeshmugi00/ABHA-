import json
import pycountry
import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import *
from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned
from Masters.models import *
from decimal import Decimal
from .models import Patient_Appointment_Registration_Detials
from django.shortcuts import render
from .models import Service_Master_Details, Service_Procedure_Charges
from django.db.models import  Q, Sum
from Ip_Workbench.models import *
from OutPatient.models import *
from django.utils import timezone




from django.db import connection, transaction
from .models import Patient_Appointment_Registration_Detials, Patient_Detials
from Workbench.models import Workbench_Prescription
from django.core.serializers import serialize
from datetime import datetime


# -------------------------------------------------------------------------------

     
@csrf_exempt
@require_http_methods(["GET"])
def Get_IP_Billing_Details(request):
    try:
        location = request.GET.get('location')
        Status = request.GET.get('Status','Pending')
        searchBy = request.GET.get('searchBy')
         
            
        Get_IPBilling_instance=IP_Billing_QueueList_Detials.objects.filter(
           ( Q(Registration_Id__PatientId__PatientId__icontains=searchBy)|
            Q(Registration_Id__PatientId__PhoneNo__icontains=searchBy)|
            Q(Registration_Id__PatientId__FirstName__icontains=searchBy)) &
            Q(Status=Status,Registration_Id__Location=location) 
        )

        Billing_data=[]

        for row in Get_IPBilling_instance:
           
           full_name = f"{row.Registration_Id.PatientId.FirstName} {row.Registration_Id.PatientId.MiddleName} {row.Registration_Id.PatientId.SurName}"

           formatted_date = row.created_at.strftime("%d/%b/%Y")

           Billing_data.append({    
                'id':row.BillingQueueList_ID,
                'VisitType' : 'IP',
                'Status': row.Status,
                'Date': formatted_date,
                'Registration_Id':row.Registration_Id.Registration_Id,
                'PatientId':row.Registration_Id.PatientId.PatientId,
                'PhoneNo':row.Registration_Id.PatientId.PhoneNo,
                'Patient_Name':full_name.strip(),
                'AgeGender': f'{row.Registration_Id.PatientId.Age}/{row.Registration_Id.PatientId.Gender}',
                'Address': f'{row.Registration_Id.PatientId.DoorNo}, {row.Registration_Id.PatientId.Street}, {row.Registration_Id.PatientId.Area}, {row.Registration_Id.PatientId.City}, {row.Registration_Id.PatientId.State}, {row.Registration_Id.PatientId.Country}, {row.Registration_Id.PatientId.Pincode}',
                'PatientCategory':row.Registration_Id.PatientCategory,
                'Doctor_ShortName':row.Doctor_Ratecard_Id.Doctor_ID.ShortName if row.Doctor_Ratecard_Id else None,
                'Title' : row.Registration_Id.PatientId.Title.Title_Name,
                'FirstName' : row.Registration_Id.PatientId.FirstName,
                'MiddleName' : row.Registration_Id.PatientId.MiddleName,
                'SurName' : row.Registration_Id.PatientId.SurName,
                'Gender' : row.Registration_Id.PatientId.Gender,
                'DOB' : row.Registration_Id.PatientId.DOB,
                'Age' : row.Registration_Id.PatientId.Age,
                'Email' : row.Registration_Id.PatientId.Email,
                'BloodGroup' : row.Registration_Id.PatientId.BloodGroup.BloodGroup_Name if row.Registration_Id.PatientId.BloodGroup else None,
                'Occupation' : row.Registration_Id.PatientId.Occupation,
                'Religion' : row.Registration_Id.PatientId.Religion.Religion_Id if row.Registration_Id.PatientId.Religion else None,
                'Nationality' :row.Registration_Id.PatientId.Nationality,
                'UniqueIdType' : row.Registration_Id.PatientId.UniqueIdType,
                'UniqueIdNo' : row.Registration_Id.PatientId.UniqueIdNo,
                # 'CaseSheetNo' : row.Registration_Id.PatientId.CasesheetNo,
                'Complaint' : row.Registration_Id.Complaint,
                'PatientCategory': row.Registration_Id.PatientCategory,
                'DoorNo' : row.Registration_Id.PatientId.DoorNo,
                'Street' :row.Registration_Id.PatientId.Street,
                'Area' :row.Registration_Id.PatientId.Area,
                'City' :row.Registration_Id.PatientId.City,
                'State' :row.Registration_Id.PatientId.State,
                'Country' :row.Registration_Id.PatientId.Country,
                'Pincode' :row.Registration_Id.PatientId.Pincode,                      
            })

        print('111111111',Billing_data)
        return JsonResponse (Billing_data,safe=False)
    except Exception  as e:
        print({'error':str(e)})
        return JsonResponse ({'error':str(e)})


@csrf_exempt
@require_http_methods(["GET"])
def Get_IP_Billing_Details_SingleId(request):
    try:
        QueueList_ID=request.GET.get('QueueList_ID')

        if not QueueList_ID:
            return JsonResponse({'error':'QueueList_ID is required'},status=400)
        try:
            row =IP_Billing_QueueList_Detials.objects.get(BillingQueueList_ID=QueueList_ID)
        
        except IP_Billing_QueueList_Detials.DoesNotExist:
            return JsonResponse ({'error': 'Billing data not found'}, status=404)


           
        full_name = f"{row.Registration_Id.PatientId.FirstName}"

        formatted_date = row.created_at.strftime("%d/%b/%Y")

        Billing_data={    
                'id':row.BillingQueueList_ID,
                'Billing_Type': row.Billing_Type,
                'Status': row.Status,
                'Date': formatted_date,
                'Registration_Id':row.Registration_Id.Registration_Id,
                'PatientId':row.Registration_Id.PatientId.PatientId,
                'PhoneNo':row.Registration_Id.PatientId.PhoneNo,
                'Patient_Name':full_name.strip(),
                'Gender':row.Registration_Id.PatientId.Gender,
                'DoorNo':row.Registration_Id.PatientId.DoorNo,
                'Age':row.Registration_Id.PatientId.Age,
                'Street':row.Registration_Id.PatientId.Street,
                'Area':row.Registration_Id.PatientId.Area,
                'City':row.Registration_Id.PatientId.City,
                'State':row.Registration_Id.PatientId.State,
                'Country':row.Registration_Id.PatientId.Country,
                'Pincode':row.Registration_Id.PatientId.Pincode,
                'VisitId':row.Registration_Id.VisitId,
                'PatientType':row.Registration_Id.PatientType,
                'PatientCategory':row.Registration_Id.PatientCategory,
                'Doctor_ID':row.Doctor_Ratecard_Id.Doctor_ID.Doctor_ID,
                'Doctor_ShortName':row.Doctor_Ratecard_Id.Doctor_ID.ShortName,
            }        
        return JsonResponse(Billing_data, safe=False)
    except Exception  as e:
        print({'error':str(e)})
        return JsonResponse ({'error':str(e)})

@csrf_exempt
@require_http_methods(['GET'])
def IP_Billing_Service_List(request):
    if request.method == "GET":
        try:
            QueueList_ID = request.GET.get('QueueList_ID')
            Billing_Invoice_No = request.GET.get('Billing_Invoice_No')
            if not Billing_Invoice_No:
                if not QueueList_ID:
                    return JsonResponse({'error': 'QueueList_ID is required'}, status=400)
                
                # Fetching service instance for the QueueList_ID
                service_instance = Service_Procedure_request_Ip.objects.filter(RegistrationId=QueueList_ID)
                print('1111')
                try:
                    row = IP_Billing_QueueList_Detials.objects.get(Registration_Id=QueueList_ID)
                except IP_Billing_QueueList_Detials.DoesNotExist:
                    return JsonResponse({'error': 'Billing data not found'}, status=404)
                
                # Fetch all physician instances for this QueueList_ID
                physicians = IP_Consultation.objects.filter(Registration_Id=QueueList_ID )

                lab_instance = Lab_Request_Selected_Details.objects.filter(IP_Register_Id = QueueList_ID)
                print('Labbbbbb',lab_instance)
                # Prepare patient data
                full_name = f"{row.Registration_Id.PatientId.FirstName}"
                formatted_date = row.created_at.strftime("%d/%b/%Y")

                Billing_data_list = []
                print('2222')

                # Loop through each service and add corresponding physician ratecards
                for service in service_instance:
                    service_type = ''
                    service_name = ''
                    service_cost = Decimal(0)
                    service_gst = Decimal(0)  # Ensure it's a Decimal

                    if service.MasterType == 'Service':
                        service_type = 'GeneralBillingItem'
                        service_name = service.Service_ratecard.Service_Name
                        service_cost = service.Service_ratecard.Amount
                        service_gst = service.Service_ratecard.GstValue
                    elif service.MasterType == 'Procedure':
                        service_type = service.MasterType
                        service_name = service.Procedure_ratecard.Procedure_Name
                        service_cost = service.Procedure_ratecard.Amount
                        service_gst = service.Procedure_ratecard.GstValue

                    # Convert quantity (Units) to Decimal and calculate the total amount
                    quantity = Decimal(service.Units)
                    total_amount = service_cost * quantity

                    # If GST is applicable, calculate GST and add it to the total amount
                    if service_gst != "Nill":
                        gst_decimal = Decimal(service_gst) / Decimal(100)  # Convert percentage to decimal
                        gst_amount = round(total_amount * gst_decimal, 2)  # Calculate the GST amount
                        total_amount_with_gst = total_amount + gst_amount  # Add GST to total amount
                    else:
                        total_amount_with_gst = total_amount
                        gst_amount = service_gst
                    print('333')
                    
                    print('4444')
                    # Append billing data for each service including physicians ratecards
                    bill_data = {
                        'Service_Type': service_type,
                        'Service_Name': service_name,
                        'Charge': round(service_cost, 2),  # Convert to float
                        'Quantity': round(service.Units,0),  # Ensure it's an int
                        'Amount': round(total_amount, 2),
                        'GST_per': service_gst,
                        'GST_Charge': gst_amount,
                        'NetAmount': round(total_amount_with_gst, 2),
                        'Status' : "UnPaid" if service.Status == False else "",
                        'created_at': service.created_at.isoformat(),  # Serialize datetime
                        'updated_at': service.updated_at.isoformat(),
                    }
                    print('billllll',bill_data)
                    Billing_data_list.append(bill_data)

                # Now loop through each physician to add consultation data separately
                for phys in physicians:
                    print('5555')
                    Doctors_Instance = Doctor_Ratecard_Master.objects.get(
                        Doctor_ID__Doctor_ID=phys.Physician.Doctor_ID.Doctor_ID
                    )
                    
                    print('Doccccc',Doctors_Instance)
                    consultation_fee = ""
                    if row.Registration_Id.PatientType == 'General':
                        consultation_fee = Doctors_Instance.General_Consultation_Fee
                    # Create a new entry for physician consultation
                    consultation_data = {
                        'Service_Type': 'Consultation',
                        'Service_Name': 'Consultation',
                        'Charge': round(Decimal(consultation_fee), 2),
                        'Quantity': phys.Units,  # Use phys.Units here for consultation quantity
                        'Amount': round(Decimal(consultation_fee), 2),
                        'GST_per': 'Nill',  # Assuming no GST for consultation, modify as needed
                        'GST_Charge': "Nill",
                        'NetAmount': round(Decimal(consultation_fee), 2),
                        'Status' : phys.Status,
                        'created_at': phys.created_at.isoformat(),  # Serialize datetime
                        'updated_at': phys.updated_at.isoformat(),
                        'Physician_ID': phys.Physician.Doctor_ID.Doctor_ID if phys.Physician else None,
                        'Physician_ShortName': phys.Physician.Doctor_ID.ShortName if phys.Physician else None,
                    }
                    print('6666',consultation_data)
                    # Append this consultation data to the Billing_data_list
                    Billing_data_list.append(consultation_data)
                    print('777')            
                
                for lab in lab_instance:
                    lab_data = {
                        'Service_Type': 'Lab',
                        'Service_Name': lab.IndivitualCode.Test_Name,
                        'Charge': round(Decimal(lab.Amount), 2),
                        'Quantity': '1' if lab.IndivitualCode else "",  # Use phys.Units here for consultation quantity
                        'Amount': round(Decimal(lab.Amount), 2),
                        'GST_per': 'Nill',  # Assuming no GST for consultation, modify as needed
                        'GST_Charge': "Nill",
                        'NetAmount': round(Decimal(lab.Amount), 2),
                        'Status' : 'UnPaid' if lab.Status == 'pending' else "",
                        'created_at': lab.created_at.isoformat(),  # Serialize datetime
                        'updated_at': lab.updated_at.isoformat(),
                    }
                    Billing_data_list.append(lab_data)
                roomdatas = Patient_Admission_Room_Detials.objects.filter(
                    IP_Registration_Id__pk= QueueList_ID, Status=True, IsStayed=True
                ).exclude(Iscanceled=True, CurrentlyStayed=True)

                emp_datas = {
                    'RoomDatas': [],
                    'NurseCharge': [],
                    'CumulativeDays': 0,
                    'CumulativeHours': 0,
                    'CumulativeTotalAmount': 0,
                    'CumulativeDaysHours': '',  # To hold combined days and hours
                }

                cumulative_days = 0
                cumulative_hours = 0
                cumulative_total_amount = 0

                for room in roomdatas:
                    # Calculate the difference between Admitted_Date and Discharge_Date
                    admitted_date = room.Admitted_Date  # Assuming datetime object
                    discharge_date = room.Discharge_Date if room.Discharge_Date else None

                    if discharge_date:
                        difference = discharge_date - admitted_date
                        days = difference.days  # Total number of full days
                        hours, remainder = divmod(difference.seconds, 3600)  # Total hours

                        # Determine how many hours to charge for based on your logic
                        if hours > 12:
                            hours_to_charge = 24  # Treat anything above 12 hours as a full day
                        elif hours > 6:
                            hours_to_charge = 12
                        elif hours > 3:
                            hours_to_charge = 6
                        elif hours > 2:
                            hours_to_charge = 3
                        else:
                            hours_to_charge = hours  # If less than or equal to 2 hours, charge actual hours
                        
                        difff = f"{days} days, {hours} hours"
                    else:
                        # Calculate difference between admitted_date and the current time (since patient is still admitted)
                        current_datetime = timezone.now()  # Use timezone-aware datetime for the current time
                        difference = current_datetime - admitted_date
                        days = difference.days  # Total number of full days
                        hours, remainder = divmod(difference.seconds, 3600)  # Total hours

                        # Determine how many hours to charge for based on your logic
                        if hours > 12:
                            hours_to_charge = 24  # Treat anything above 12 hours as a full day
                        elif hours > 6:
                            hours_to_charge = 12
                        elif hours > 3:
                            hours_to_charge = 6
                        elif hours > 2:
                            hours_to_charge = 3
                        else:
                            hours_to_charge = hours  # If less than or equal to 2 hours, charge actual hours
                        
                        difff = f"{days} days, {hours} hours"
                    
                    # Calculate the total amount
                    room_charge_per_hour = room.RoomId.Ward_Name.Current_Charge / 24  # Assuming the daily charge is divided into 24 hours
                    total_amount = (days * room.RoomId.Ward_Name.Current_Charge) + (hours_to_charge * room_charge_per_hour)
                    
                    print('ammmm',total_amount)
                    # Add to cumulative totals
                    cumulative_days += days
                    cumulative_hours += hours
                    cumulative_total_amount += total_amount

                    roomdetials = {
                        'id': len(emp_datas['RoomDatas']) + 1,
                        "WardName": room.RoomId.Ward_Name.Ward_Name,
                        "RoomName": room.RoomId.Ward_Name.Ward_Name,
                        "Room_No": room.RoomId.Room_No,
                        "Bed_No": room.RoomId.Bed_No,
                        "Charge": int(room.RoomId.Ward_Name.Current_Charge),
                        'Amount': round(total_amount, 2),
                        "GST": room.RoomId.Ward_Name.GST_Charge if room.RoomId.Ward_Name.GST_Charge != 'Nill' else "",
                        "Total_Current_Charge": int(room.RoomId.Ward_Name.Current_Charge),
                        "Admitted_Date": admitted_date.strftime('%d-%m-%y / %I-%M %p'),
                        "Discharge_Date": discharge_date.strftime('%d-%m-%y / %I-%M %p') if discharge_date else None,
                        "Days": difff,
                        "Total_amount": round(total_amount, 2)  # Total charge rounded to 2 decimal places
                    }
                    emp_datas['RoomDatas'].append(roomdetials)

                # Add cumulative totals to the response data
                emp_datas['CumulativeDays'] = cumulative_days
                emp_datas['CumulativeHours'] = cumulative_hours
                emp_datas['CumulativeTotalAmount'] = round(cumulative_total_amount, 2)

                # Combine cumulative days and hours into a single string
                emp_datas['CumulativeDaysHours'] = f"{cumulative_days} days, {cumulative_hours} hours"
                # Billing_data_list.append(emp_datas)

            else:
                pass
            Billing_data = {    
                'id': row.BillingQueueList_ID,
                'Billing_Type': row.Billing_Type,
                'Status': row.Status,
                'Date': formatted_date,
                'Registration_Id': row.Registration_Id.Registration_Id,
                'PatientId': row.Registration_Id.PatientId.PatientId,
                'PhoneNo': row.Registration_Id.PatientId.PhoneNo,
                'Patient_Name': full_name.strip(),
                'Gender': row.Registration_Id.PatientId.Gender,
                'DoorNo': row.Registration_Id.PatientId.DoorNo,
                'Age': row.Registration_Id.PatientId.Age,
                'Street': row.Registration_Id.PatientId.Street,
                'Area': row.Registration_Id.PatientId.Area,
                'City': row.Registration_Id.PatientId.City,
                'State': row.Registration_Id.PatientId.State,
                'Country': row.Registration_Id.PatientId.Country,
                'Pincode': row.Registration_Id.PatientId.Pincode,
                # 'VisitId': row.Registration_Id.VisitId,
                'PatientType': row.Registration_Id.PatientId.PatientType,
                'PatientCategory': row.Registration_Id.PatientCategory,
                'Doctor_ID': row.Doctor_Ratecard_Id.Doctor_ID.Doctor_ID if row.Doctor_Ratecard_Id else None,
                'Doctor_ShortName': row.Doctor_Ratecard_Id.Doctor_ID.ShortName if row.Doctor_Ratecard_Id else None,}
            
            
            ip_bill_service_data = {
                'Billing_data_list': Billing_data_list,
                'Billing_data': Billing_data,
                'Room_data': emp_datas,
            }    
            print('9999') 
            return JsonResponse(ip_bill_service_data, safe=False)
        
        except Exception as e:
            return JsonResponse({"error": str(e)})

        
# @csrf_exempt
# @require_http_methods(['GET'])
# def IP_Billing_Service_List(request):
#     if request.method == "GET":
#         try:
#             QueueList_ID = request.GET.get('QueueList_ID')
        
            
#             print('Queeeee',QueueList_ID)
#             if not QueueList_ID:
#                 return JsonResponse({'error': 'QueueList_ID is required'}, status=400)
            
#             try:
#                 service_instance = IP_Billing_Entry.objects.filter(Registration_Id=QueueList_ID)
#                 print('service_insss',service_instance)
#             except IP_Billing_Entry.DoesNotExist:
#                 return JsonResponse({'error': 'QueueList_ID not found'}, status=404)

#             try:
#                 row =IP_Billing_QueueList_Detials.objects.get(Registration_Id=QueueList_ID)
#             except IP_Billing_QueueList_Detials.DoesNotExist:
#                 return JsonResponse ({'error': 'Billing data not found'}, status=404)

#             Doctors_Instance = Doctor_Ratecard_Master.objects.get(Doctor_ID__Doctor_ID = row.Doctor_Ratecard_Id.Doctor_ID.Doctor_ID)
#             print('DoctorRatecardInstance:', Doctors_Instance)



#             full_name = f"{row.Registration_Id.PatientId.FirstName}"
#             formatted_date = row.created_at.strftime("%d/%b/%Y")
            
#             Billing_data_list = []
#             # indx = 1
#             for service in service_instance:
#                 service_name = ''
#                 service_cost = Decimal(0) 
#                 service_gst = Decimal(0)  # Ensure it's a Decimal
                
#                 physician_id = service.Physician if hasattr(service, 'Physician') else None
#                 if physician_id:
#                     try:
#                         consultation_fee = ""
#                         print('DocCheckkkk')
#                         Doctors_Instance = Doctor_Ratecard_Master.objects.get(Doctor_ID__Doctor_ID=physician_id.Doctor_ID.Doctor_ID)
#                         print('Doccccc',Doctors_Instance.General_Consultation_Fee)
#                         if row.Registration_Id.PatientType == 'General':
#                             consultation_fee = Doctors_Instance.General_Consultation_Fee
#                         # elif row.Registration_Id.PatientType == 'General':
#                         #     consultation_fee = Doctors_Instance.
#                         # You can fetch any specific fields from Doctors_Instance if needed
#                     except Doctor_Ratecard_Master.DoesNotExist:
#                         return JsonResponse({'error': f'Doctor not found for Physician ID: {physician_id}'}, status=404)
#                 if service.ServiceType == 'Consultation':
#                     service_name = 'Consultation'
#                     service_cost = consultation_fee
#                 elif service.ServiceType == 'Pharmacy':
#                     service_name = service.DrugName
#                 elif service.ServiceType == 'Lab':
#                     service_name = service.LabTest
#                 elif service.ServiceType == 'Radiology':
#                     service_name = service.RadiologyTest
#                 elif service.ServiceType == 'Service':
#                     service_name = service.Service.Service_Name
#                     service_cost = service.Service.Amount
#                     service_gst = service.Service.GstValue
#                     print('service_cost',service_cost)
#                     print('service_cost_amount',service.Service.Amount)
#                     print('service_gst',service_gst)
#                 elif service.ServiceType == 'Procedure':
#                     service_name = service.Procedure.Procedure_Name
#                     service_cost = service.Procedure.Amount
#                     service_gst = service.Procedure.GstValue

                
                
                
#                 # Convert quantity (Units) to Decimal and calculate the total amount
#                 quantity = Decimal(service.Units)
#                 total_amount = service_cost * quantity
#                 print('Totalllll',total_amount)
#                 # If GST is applicable, calculate GST and add it to the total amount
#                 if service_gst != "Nill":
#                     print('22222')
#                     gst_decimal = Decimal(service_gst) / Decimal(100)  # Convert percentage to decimal
#                     print('gst_ddec',gst_decimal)
#                     gst_amount = round(total_amount * gst_decimal,2)  # Calculate the GST amount
#                     total_amount_with_gst = total_amount + gst_amount  # Add GST to total amount
#                     print(f"GST Amount: {gst_amount}, Total Amount with GST: {total_amount_with_gst}")
#                 else:
#                     total_amount_with_gst = total_amount
#                     gst_amount = service_gst

#                 bill_data = {
#                     # 'BillingDataList_ID': str(bill.BillingDataList_ID.BillingQueueList_ID),  # Serialize ID as string
#                     'Service_Type': service.ServiceType,
#                     'Service_Name': service_name,
#                     'Charge': round(service_cost,2),  # Convert to float
#                     'Quantity': service.Units,  # Ensure it's an int
#                     'Amount': round(service_cost,2),
#                     'GST_per': service_gst,
#                     'GST_Charge' : gst_amount,
#                     'NetAmount': round(total_amount_with_gst,2),
#                     'created_at': service.created_at.isoformat(),  # Serialize datetime
#                     'updated_at': service.updated_at.isoformat(),
#                 }
#                 Billing_data_list.append(bill_data)

#             Billing_data={    
#                 'id':row.BillingQueueList_ID,
#                 'Billing_Type': row.Billing_Type,
#                 'Status': row.Status,
#                 'Date': formatted_date,
#                 'Registration_Id':row.Registration_Id.Registration_Id,
#                 'PatientId':row.Registration_Id.PatientId.PatientId,
#                 'PhoneNo':row.Registration_Id.PatientId.PhoneNo,
#                 'Patient_Name':full_name.strip(),
#                 'Gender':row.Registration_Id.PatientId.Gender,
#                 'DoorNo':row.Registration_Id.PatientId.DoorNo,
#                 'Age':row.Registration_Id.PatientId.Age,
#                 'Street':row.Registration_Id.PatientId.Street,
#                 'Area':row.Registration_Id.PatientId.Area,
#                 'City':row.Registration_Id.PatientId.City,
#                 'State':row.Registration_Id.PatientId.State,
#                 'Country':row.Registration_Id.PatientId.Country,
#                 'Pincode':row.Registration_Id.PatientId.Pincode,
#                 'VisitId':row.Registration_Id.VisitId,
#                 'PatientType':row.Registration_Id.PatientType,
#                 'PatientCategory':row.Registration_Id.PatientCategory,
#                 'Doctor_ID':row.Doctor_Ratecard_Id.Doctor_ID.Doctor_ID,
#                 'Doctor_ShortName':row.Doctor_Ratecard_Id.Doctor_ID.ShortName,
#             }
            
#             ip_bill_service_data = {
#                 'Billing_data_list' : Billing_data_list,
#                 'Billing_data' : Billing_data,
#             }     
#             return JsonResponse(ip_bill_service_data, safe=False)
        
#         except Exception as e:
#             return JsonResponse({"error": str(e)})

# @csrf_exempt
# @require_http_methods(['GET'])
# def IP_Billing_Service_List(request):
#     if request.method == "GET":
#         try:
#             QueueList_ID = request.GET.get('QueueList_ID')
            
#             if not QueueList_ID:
#                 return JsonResponse({'error': 'QueueList_ID is required'}, status=400)
            
#             try:
#                 Billing_data = IP_Billing_Add_Services.objects.filter(BillingDataList_ID=QueueList_ID)
#             except IP_Billing_QueueList_Detials.DoesNotExist:
#                 return JsonResponse({'error': 'Billing data not found'}, status=404)

#             try:
#                 row =IP_Billing_QueueList_Detials.objects.get(BillingQueueList_ID=QueueList_ID)
#             except IP_Billing_QueueList_Detials.DoesNotExist:
#                 return JsonResponse ({'error': 'Billing data not found'}, status=404)

           
#             full_name = f"{row.Registration_Id.PatientId.FirstName}"
#             formatted_date = row.created_at.strftime("%d/%b/%Y")

#             Billing_data_list = []
#             for bill in Billing_data:
#                 bill_data = {
#                     'BillingDataList_ID': str(bill.BillingDataList_ID.BillingQueueList_ID),  # Serialize ID as string
#                     'Service_Type': bill.Service_Type,
#                     'Service_Name': bill.Service_Name,
#                     'Service_Code': bill.Service_Code,
#                     'Charge': float(bill.Charge),  # Convert to float
#                     'Quantity': int(bill.Quantity),  # Ensure it's an int
#                     'Amount': float(bill.Amount),
#                     'Discount_Type': bill.Discount_Type,
#                     'Discount': float(bill.Discount) if bill.Discount else 0,  # Convert to float, default 0
#                     'Taxable_Amount': float(bill.Taxable_Amount),
#                     'GST_Charge': float(bill.GST_Charge) if bill.GST_Charge else 0,
#                     'NetAmount': float(bill.NetAmount),
#                     'Location': str(bill.Location.Location_Id) if bill.Location else '',  # Convert Location to string
#                     'created_by': str(bill.created_by) if bill.created_by else '',  # Convert to string
#                     'updated_by': str(bill.updated_by) if bill.updated_by else '',
#                     'created_at': bill.created_at.isoformat(),  # Serialize datetime
#                     'updated_at': bill.updated_at.isoformat(),
#                 }
#                 Billing_data_list.append(bill_data)

#             Billing_data={    
#                 'id':row.BillingQueueList_ID,
#                 'Billing_Type': row.Billing_Type,
#                 'Status': row.Status,
#                 'Date': formatted_date,
#                 'Registration_Id':row.Registration_Id.Registration_Id,
#                 'PatientId':row.Registration_Id.PatientId.PatientId,
#                 'PhoneNo':row.Registration_Id.PatientId.PhoneNo,
#                 'Patient_Name':full_name.strip(),
#                 'Gender':row.Registration_Id.PatientId.Gender,
#                 'DoorNo':row.Registration_Id.PatientId.DoorNo,
#                 'Age':row.Registration_Id.PatientId.Age,
#                 'Street':row.Registration_Id.PatientId.Street,
#                 'Area':row.Registration_Id.PatientId.Area,
#                 'City':row.Registration_Id.PatientId.City,
#                 'State':row.Registration_Id.PatientId.State,
#                 'Country':row.Registration_Id.PatientId.Country,
#                 'Pincode':row.Registration_Id.PatientId.Pincode,
#                 'VisitId':row.Registration_Id.VisitId,
#                 'PatientType':row.Registration_Id.PatientType,
#                 'PatientCategory':row.Registration_Id.PatientCategory,
#                 'Doctor_ID':row.Doctor_Ratecard_Id.Doctor_ID.Doctor_ID,
#                 'Doctor_ShortName':row.Doctor_Ratecard_Id.Doctor_ID.ShortName,
#             }
            
#             ip_bill_service_data = {
#                 'Billing_data_list' : Billing_data_list,
#                 'Billing_data' : Billing_data,
#             }     
#             return JsonResponse(ip_bill_service_data, safe=False)
        
#         except Exception as e:
#             return JsonResponse({"error": str(e)})

@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def IPBilling_Link(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            
            # Extract data from the request
            billAmount = data.get('billAmount', [])
            SelectedPatient_list = data.get('SelectedPatient_list', {})
            NetAmount_CDmethod = data.get('NetAmount_CDmethod', {})
            SelectDatalist = data.get('SelectDatalist', [])
            BillingData = data.get('BillingData', {})
            initialState = data.get('initialState', {})
            Created_by = data.get('Created_by', '')
            Location = data.get('Location', '')
            selectedOption = data.get('selectedOption', '')

            print('IPPPPPP',data)
            # Fetch related foreign key objects
            try:
                doctor = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=BillingData.get('DoctorId'))
            except ObjectDoesNotExist:
                return JsonResponse({'error': 'Doctor not found'})
            except MultipleObjectsReturned:
                return JsonResponse({'error': 'Multiple doctors found'})

            try:
                patient = Patient_Detials.objects.get(PatientId=SelectedPatient_list.get('PatientId'))
            except ObjectDoesNotExist:
                return JsonResponse({'error': 'Patient not found'})
            except MultipleObjectsReturned:
                return JsonResponse({'error': 'Multiple patients found'})

            try:
                register = Patient_IP_Registration_Detials.objects.get(Registration_Id=SelectedPatient_list.get('RegisterId'))
            except ObjectDoesNotExist:
                return JsonResponse({'error': 'Registration not found'})
            except MultipleObjectsReturned:
                return JsonResponse({'error': 'Multiple registrations found'})

            try:
                visit = Patient_Visit_Detials.objects.get(
                    PatientId=SelectedPatient_list.get('PatientId'),
                    VisitId=SelectedPatient_list.get('VisitId')
                )
            except ObjectDoesNotExist:
                return JsonResponse({'error': 'Patient visit details not found'})
            except MultipleObjectsReturned:
                return JsonResponse({'error': 'Multiple patient visit details found'})

            # Convert to Decimal
            def to_decimal(value):
                try:
                    return float(value)
                except (TypeError, ValueError):
                    return Decimal('0.00')

            # Create and save the General Billing entry
            ip_billing = IP_Billing_Table_Detials(
                Billing_Date=BillingData.get('InvoiceDate'),
                Doctor_Id=doctor,
                Patient_Id=patient,
                Register_Id=register,
                Visit_Id=visit,
                Billing_Type=NetAmount_CDmethod.get('Method'),
                Select_Discount=NetAmount_CDmethod.get('Method'),
                Discount_Type=NetAmount_CDmethod.get('Method'),
                Discount_Value=to_decimal(NetAmount_CDmethod.get('Amount')),
                Discount_Amount=to_decimal(initialState.get('totalDiscount')),
                Total_Items=int(initialState.get('totalItems')),
                Total_Qty=int(initialState.get('totalUnits')),
                Total_Amount=to_decimal(initialState.get('totalTaxable')),
                Total_GSTAmount=to_decimal(initialState.get('totalGstamount')),
                Net_Amount=to_decimal(initialState.get('totalNetAmount')),
                Round_Off=to_decimal(initialState.get('Roundoff')),
                Paid_Amount=to_decimal(initialState.get('PaidAmount')),
                Balance_Amount=to_decimal(initialState.get('BalanceAmount')),
                Bill_Status="Paid" if initialState.get('BalanceAmount') == '0.00' else 'UnPaid',
                created_by=Created_by,
            )
            ip_billing.save()

            # Save each item in the General Billing Items Table Details
            for item in SelectDatalist:
                ip_billing_item = IP_Billing_Items_Table_Detials(
                    Billing_Invoice_No=ip_billing,
                    Service_Type=item.get('ServiceType'),
                    Service_Name=item.get('SelectItemName'),
                    Rate=to_decimal(item.get('Rate')),
                    Charge=to_decimal(item.get('Charges')),
                    Quantity=item.get('Quantity'),
                    Amount=to_decimal(item.get('Amount')),
                    Discount_Type=item.get('DiscountType'),
                    Discount_Value=to_decimal(item.get('Discount')),
                    Discount_Amount=to_decimal(item.get('DiscountAmount')),
                    Taxable_Amount=to_decimal(item.get('Amount')),
                    Tax_Percentage=to_decimal(item.get('GST')) if item.get('GST') else Decimal('0.00'),
                    Tax_Amount=to_decimal(item.get('GSTamount')),
                    Total_Amount=to_decimal(item.get('Total')),
                    Item_Status="Paid",
                )
                ip_billing_item.save()

            # Save multiple payment details
            for payment in billAmount:
                multiple_payment = Multiple_Payment_Table_IP_Detials(
                    Invoice_No=ip_billing,
                    Payment_Type=payment.get('Billpay_method'),
                    Cart_Type=payment.get('CardType'),
                    Cheque_No=payment.get('ChequeNo'),
                    Bank_Name=payment.get('BankName'),
                    Amount=to_decimal(payment.get('paidamount')),
                    Transaction_Amount = to_decimal(payment.get('transactionFee')),
                    AdditionalAmount = to_decimal(payment.get('Additionalamount')),
                )
                multiple_payment.save()

            # Update the billing queue list status
            if SelectedPatient_list.get('QueueList_ID') and initialState.get('BalanceAmount') == '0.00':
                try:
                    billing_queue_list_instance = IP_Billing_QueueList_Detials.objects.get(BillingQueueList_ID=SelectedPatient_list.get('QueueList_ID'))
                    # billing_queue_list_instance.Status = 'Completed'
                    billing_queue_list_instance.save()
                except ObjectDoesNotExist:
                    return JsonResponse({'error': 'Billing Queue List not found'})
                except MultipleObjectsReturned:
                    return JsonResponse({'error': 'Multiple Billing Queue List instances found'})

            return JsonResponse({'status': 'success', 'message': 'Billing details saved successfully','InvoiceNo':ip_billing.Billing_Invoice_No})

        except Exception as e:
            print({'error':str(e)})
            return JsonResponse({'error': str(e)})
    
    elif request.method == "GET":
        try:
            invoice_no = request.GET.get('InvoiceNO')
            general_billing_data = IP_Billing_Table_Detials.objects.filter(Billing_Invoice_No = invoice_no, Bill_Status = 'UnPaid' )
            response_data = []

            for row in general_billing_data:
                # Construct the patient's full name
                full_name = f"{row.Patient_Id.FirstName} {row.Patient_Id.MiddleName or ''} {row.Patient_Id.SurName}".strip()

                # Prepare the general billing details
                billing_details = {
                    'id': row.Billing_Invoice_No,
                    'Billing_Date': row.Billing_Date,
                    'Doctor_Id': row.Doctor_Id.Doctor_ID,
                    'Doctor_Name': row.Doctor_Id.ShortName,
                    'Patient_Id': row.Patient_Id.PatientId,
                    'Patient_Name': full_name,
                    'PhoneNumber': row.Patient_Id.PhoneNo,
                    'Register_Id': row.Register_Id.Registration_Id,
                    'Visit_Id': row.Visit_Id.VisitId,
                    'Billing_Type': row.Billing_Type,
                    'Net_Amount': row.Net_Amount,
                    'Bill_Status': row.Bill_Status,
                    'Billing_Items': [],
                    'Payment_Details': [],
                }

                # Fetch related billing items
                billing_items = IP_Billing_Items_Table_Detials.objects.filter(Billing_Invoice_No=row.Billing_Invoice_No)
                print('11111',billing_items)
                for item in billing_items:
                    item_details = {
                        'Service_Type': item.Service_Type,
                        'Service_Name': item.Service_Name,
                        'Rate': item.Rate,
                        'Charge': item.Charge,
                        'Quantity': item.Quantity,
                        'Amount': item.Amount,
                        'Discount_Type': item.Discount_Type,
                        'Discount_Value': item.Discount_Value,
                        'Discount_Amount': item.Discount_Amount,
                        'Taxable_Amount': item.Taxable_Amount,
                        'Tax_Percentage': item.Tax_Percentage,
                        'Tax_Amount': item.Tax_Amount,
                        'Total_Amount': item.Total_Amount,
                    }
                    billing_details['Billing_Items'].append(item_details)
                print('22222')
                # Fetch related payment details
                payment_details = Multiple_Payment_Table_IP_Detials.objects.filter(Invoice_No=row.Billing_Invoice_No)
                print('33333',payment_details)
                for payment in payment_details:
                    payment_info = {
                        'Payment_Type': payment.Payment_Type,
                        'Cart_Type': payment.Cart_Type,
                        'Cheque_No': payment.Cheque_No,
                        'Bank_Name': payment.Bank_Name,
                        'Amount': payment.Amount,
                    }
                    billing_details['Payment_Details'].append(payment_info)

                # Add the billing details to the response data
                response_data.append(billing_details)

            return JsonResponse(response_data, safe=False)

        except Exception as e:
            print({'error': str(e)})
            return JsonResponse({'error': str(e)})

            

    return JsonResponse({'status': 'failure', 'message': 'Invalid request method'})



@csrf_exempt
@require_http_methods(["GET"])
def Filter_Patient_data_For_Billing(request):
    try:
        first_name = request.GET.get("FirstName", None)
        phone_no = request.GET.get("PhoneNo", None)
        patient_id = request.GET.get("PatientId", None)

        filter_Conditions=Q()

        if first_name:
            filter_Conditions &= Q(FirstName__icontains=first_name)
        if phone_no:
            filter_Conditions &= Q(PhoneNo__icontains=phone_no)
        if patient_id:
            filter_Conditions &= Q(PatientId__icontains=patient_id)

        patients = Patient_Detials.objects.filter(filter_Conditions,DuplicateId=False)
        print('patients :', patients)

        patient_data = [
            {
                'PatientId': patient.PatientId,
                'PhoneNo': patient.PhoneNo,
                'FirstName': patient.FirstName,
                'Gender':patient.Gender,
                'DoorNo':patient.DoorNo,
                'Age':patient.Age,
                'Street':patient.Street,
                'Area':patient.Area,
                'City':patient.City,
                'State':patient.State,
                'Country':patient.Country,
                'Pincode':patient.Pincode,

            } for patient in patients
        ]

       
        return JsonResponse(patient_data, safe=False)

    
    except Exception as e:
        print({f'error:{str(e)}'})
        return JsonResponse({'error':'An internal server error occurred'},status=500)


 
# @csrf_exempt
# def get_merged_service_data(request):
#     services = Service_Master_Details.objects.exclude(Department='IP').values(
#         'Service_Id', 'Service_Name', 'Department', 'IsGst', 'GstValue', 'Status', 'created_by', 'created_at', 'updated_at'
#     )
#     charges = Service_Procedure_Charges.objects.select_related(
#         'Service_ratecard', 'Procedure_ratecard', 'Location'
#     ).all().values(
#         'MasterType', 'Service_ratecard__Service_Id', 'Service_ratecard__Service_Name', 'Procedure_ratecard__Procedure_Name', 'Location__Location_Name',
#         'General_Prev_fee', 'General_fee', 'Special_Prev_fee', 'Special_fee'
#     )
#     merged_data = []

#     service_dict = {service['Service_Id']: service for service in services}
    
#     for charge in charges:
#         if charge['MasterType'] == 'Service':
#             service_id = charge['Service_ratecard__Service_Id']
#             service_info = service_dict.get(service_id, {})
#             merged_data.append({
#                 'Type': 'Service',
#                 'Service_Id': service_id,
#                 'Service_Name': charge['Service_ratecard__Service_Name'],
#                 'GstValue': service_info.get('GstValue', 'N/A'),
#                 'Location': charge['Location__Location_Name'],
#                 'General_Prev_fee': charge['General_Prev_fee'],
#                 'General_fee': charge['General_fee'],
#                 'Special_Prev_fee': charge['Special_Prev_fee'],
#                 'Special_fee': charge['Special_fee']
#             })
#         elif charge['MasterType'] == 'Procedure':
#             merged_data.append({
#                 'Type': 'Procedure',
#                 'Procedure_Name': charge['Procedure_ratecard__Procedure_Name'],
#                 'Location': charge['Location__Location_Name'],
#                 'General_Prev_fee': charge['General_Prev_fee'],
#                 'General_fee': charge['General_fee'],
#                 'Special_Prev_fee': charge['Special_Prev_fee'],
#                 'Special_fee': charge['Special_fee']
#             })
    
#     return JsonResponse(merged_data,safe=False)





@csrf_exempt
def get_merged_service_data_bill(request):
    try:
        selectedOption = request.GET.get('ServiceProcedureForm')
        location = request.GET.get('location')
        PatientCategory = request.GET.get('PatientCategory')
        PatientCategoryType = request.GET.get('PatientCategoryType', None)
        ServiceType = request.GET.get('ServiceType', 'Interventional')
        merged_data = []
        print('22222',selectedOption)
        print('33333',location)
        print('44444',PatientCategory)
        print('55555',PatientCategoryType)
        print('66666',ServiceType)
        
        if selectedOption == 'GeneralBillingItem':
            ser_pro_inss = Service_Master_Details.objects.filter(Status=True)
            print('hiiii',ser_pro_inss)
        elif selectedOption == 'Procedure':
            ser_pro_inss = Procedure_Master_Details.objects.filter(Status=True, Type=ServiceType)
            print('hello',ser_pro_inss)

        
        for inss in ser_pro_inss:
            data = {
                'Service_Id': inss.pk,
                'Service_Name': inss.Service_Name if selectedOption == 'GeneralBillingItem' else inss.Procedure_Name,
                'GstValue': inss.GstValue if inss.IsGst == 'Yes' else "Nill",
                'charge' : inss.Amount if selectedOption == 'IPDServices' else inss.Amount,
            }
            print('11111111',data)

            # Filter conditions
            filter_conditions = Q()
            if selectedOption == 'GeneralBillingItem':
                filter_conditions &= Q(Service_ratecard__pk=inss.pk, Location__pk=location)
                print('IPDServices',filter_conditions)
            elif selectedOption == 'Procedure':
                filter_conditions &= Q(Procedure_ratecard__pk=inss.pk, Location__pk=location)
                print('IPDProcedures',filter_conditions)

            try:
                print('Summmmaaaaa')

                inss_ser_pro = Service_Procedure_Charges.objects.filter(filter_conditions).first()
                print('hiiiii1111',inss_ser_pro)

                charges_gen_spe = Service_Procedure_Rate_Charges.objects.filter(Service_Procedure_ratecard=inss_ser_pro).first()
                
                print('hiiiii2222',charges_gen_spe)

                if PatientCategory == 'General':
                    data['charge'] = charges_gen_spe.General_fee
                elif PatientCategory == 'Special':
                    data['charge'] = charges_gen_spe.Special_fee
                elif PatientCategory == 'Insurance' and PatientCategoryType:
                    ins_ins = Service_Procedure_InsuranceFee.objects.get(Service_Procedure_ratecard=inss_ser_pro, insurance__pk=PatientCategoryType)
                    data['charge'] = ins_ins.fee
                elif PatientCategory == 'Client' and PatientCategoryType:
                    cli_ins = Service_Procedure_ClientFee.objects.get(Service_Procedure_ratecard=inss_ser_pro, client__pk=PatientCategoryType)
                    data['charge'] = cli_ins.fee
                    
            except Service_Procedure_Charges.DoesNotExist:
                print('Service_Procedure_Charges doesnt exist')
                # data['charge'] = ""
            except Service_Procedure_Rate_Charges.DoesNotExist:
                print('Service_Procedure_Rate_Charges doesnt exist')
                # data['charge'] = ""
            except (Service_Procedure_InsuranceFee.DoesNotExist, Service_Procedure_ClientFee.DoesNotExist):
                print('Service_Procedure_InsuranceFee doesnt exist')
                # data['charge'] = ""

            merged_data.append(data)
        
        return JsonResponse(merged_data, safe=False)

    except Exception as e:
        print(f'error: {str(e)}')
        return JsonResponse({'error': 'An internal server error occurred'})


@csrf_exempt
@require_http_methods(['POST','GET'])
def get_client_insurance_details(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            PatientId = data.get('PatientId')
            isClient = data.get('isClient')
            CoPaymentType = data.get('CoPaymentType')
            CoPaymentTypeinp = data.get('CoPaymentTypeinp')
            CoPaymentLogic = data.get('CoPaymentLogic')
            CoPaymentdeducted = data.get('CoPaymentdeducted')
            PreAuthType = data.get('PreAuthType')
            PreAuthTypeinp = data.get('PreAuthTypeinp')
            PreAuthAmount = data.get('PreAuthAmount')
            PreAuthApprovalNo = data.get('PreAuthApprovalNo')
            PolicyNo = data.get('PolicyNo')
            PolicyStartDate = data.get('PolicyStartDate')
            PolicyEndDate = data.get('PolicyEndDate')
            Created_by = data.get('Created_by')
            Location = data.get('Location')
            
            print('11111111',data)
            patient_instance = Patient_Detials.objects.get(PatientId = PatientId)
            print('222222222',patient_instance)
            locationget=Location_Detials.objects.get(Location_Id=Location)

            
            client_instance = Patient_Client_Insurance_details(
                Patient_Id = patient_instance,
                isClient = isClient,
                CoPaymentType = CoPaymentType,
                CoPaymentTypeinp = CoPaymentTypeinp,
                CoPaymentLogic = CoPaymentLogic,
                CoPaymentdeducted = CoPaymentdeducted,
                PreAuthType = PreAuthType,
                PreAuthTypeinp = PreAuthTypeinp,
                PreAuthAmount = PreAuthAmount,
                PreAuthApprovalNo = PreAuthApprovalNo,
                PolicyNo = PolicyNo,
                PolicyStartDate = PolicyStartDate,
                PolicyEndDate = PolicyEndDate,
                created_by = Created_by,
                Location = locationget,
            )
            
            print('333333',client_instance)
            client_instance.save()
            return JsonResponse({'success':"Client Details Added Successfully"}, safe=False)

        except Exception as e:
            return JsonResponse({'error': str(e)})
    
    elif request.method == 'GET':
        try:
            PatientId = request.GET.get('PatientId')
            
            # Query the patient insurance details for the given PatientId
            patient_instance = Patient_Client_Insurance_details.objects.filter(Patient_Id=PatientId).first()

            if not patient_instance:
                return JsonResponse({'error': 'No insurance details found for this PatientId'}, safe=False)

            # Format the patient details into a dictionary
            client_instance = {
                "PatientId": patient_instance.Patient_Id.PatientId,
                "isClient": patient_instance.isClient,
                "CoPaymentType": patient_instance.CoPaymentType,
                "CoPaymentTypeinp": patient_instance.CoPaymentTypeinp,
                "CoPaymentLogic": patient_instance.CoPaymentLogic,
                "CoPaymentdeducted": patient_instance.CoPaymentdeducted,
                "PreAuthType": patient_instance.PreAuthType,
                "PreAuthTypeinp": patient_instance.PreAuthTypeinp,
                "PreAuthAmount": patient_instance.PreAuthAmount,
                "PreAuthApprovalNo": patient_instance.PreAuthApprovalNo,
                "PolicyNo": patient_instance.PolicyNo,
                "PolicyStartDate": patient_instance.PolicyStartDate,
                "PolicyEndDate": patient_instance.PolicyEndDate,
            }

            # Return the details in dictionary format
            return JsonResponse(client_instance, safe=False)

        except Exception as e:
            return JsonResponse({'error': str(e)})

# Get the list of countries
@csrf_exempt
@require_http_methods(['GET'])
def get_countries(request):
    try:
        # Fetch country names using pycountry
        countries = [{'code': country.alpha_2, 'name': country.name} for country in pycountry.countries]
        return JsonResponse({'countries': countries}, safe=False)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

# Get states (administrative subdivisions) based on selected country
@csrf_exempt
@require_http_methods(['GET'])
def get_states(request):
    try:
        country_code = request.GET.get('country_code')
        if not country_code:
            return JsonResponse({'error': 'Country code parameter is missing'}, status=400)
        
        # Fetch the states (administrative subdivisions) for the selected country
        subdivisions = pycountry.subdivisions.get(country_code=country_code)
        states = [{'code': sub.code, 'name': sub.name} for sub in subdivisions]
        return JsonResponse({'states': states}, safe=False)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
    

@csrf_exempt
@require_http_methods(['GET'])
def get_location_by_pincode(request):
    try:
        pincode = request.GET.get('pincode')
        if not pincode:
            return JsonResponse({'error': 'Pincode is required'}, status=400)
       
        # Use Zippopotam.us API to get country, state, and city info based on postal code
        response = requests.get(f"http://api.zippopotam.us/in/{pincode}")
        district = get_district_by_pincode(pincode)  # Replace with actual logic
        if response.status_code != 200:
            return JsonResponse({'error': 'Location not found for this pincode'}, status=404)
 
        location_data = response.json()
        country = location_data['country']
        state = location_data['places'][0]['state']
        city = location_data['places'][0]['place name']  # Extracting the city name
       
        return JsonResponse({'country': country, 'state': state, 'city': city, 'district' : district}, safe=False)
   
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
   
 
def get_district_by_pincode(pincode):
    # Fetch location data dynamically from India Post API or similar
    response = requests.get(f"https://api.postalpincode.in/pincode/{pincode}")
   
    if response.status_code != 200 or not response.json():
        return JsonResponse({'error': 'Location not found for this pincode'}, status=404)
   
    location_data = response.json()[0]
    if location_data['Status'] != 'Success':
        return JsonResponse({'error': 'Invalid pincode or data not available'}, status=404)
   
    # Extract district and other details
    post_office_data = location_data['PostOffice'][0]
    district = post_office_data.get('District', 'District not found')
    print('Disssssss',district)
    return district
   
  
    

# Geonames username (replace 'your_geonames_username' with your actual username)
GEONAMES_USERNAME = 'sridhar0507'

@csrf_exempt
@require_http_methods(['GET'])
def get_location_by_params(request):
    try:
        # Get the parameters from the request
        pincode = request.GET.get('pincode', '')
        country = request.GET.get('country', '')
        state = request.GET.get('state', '')
        city = request.GET.get('city', '')
        
        # Ensure at least one parameter is passed
        if not (pincode or country or state or city):
            return JsonResponse({'error': 'At least one parameter is required'}, status=400)

        # Base URL for Geonames postalCodeSearch API
        base_url = "http://api.geonames.org/postalCodeSearchJSON"

        # Prepare the request parameters based on what is provided
        params = {
            'postalcode': pincode,
            'placename': city if city else '',  # Geonames uses placename for cities
            'adminName1': state if state else '',  # adminName1 is the state field in Geonames
            'country': country if country else '',
            'maxRows': 1,  # We only need one result
            'username': GEONAMES_USERNAME
        }
        print('111111',params)
        # Make the API request
        response = requests.get(base_url, params=params)
        print('22222222', response)
        if response.status_code != 200:
            return JsonResponse({'error': 'Failed to fetch data from Geonames API'})

        # Parse the API response
        location_data = response.json()
        postal_codes = location_data.get('postalCodes', [])
        if not postal_codes:
            return JsonResponse({'error': 'No location data found'})

        # Extract the first postal code result
        result = postal_codes[0]
        
        # Initialize the location information
        location_info = {
            'pincode': result.get('postalCode', ''),
            'country': result.get('countryCode', ''),
            'state': result.get('adminName1', ''),
            'city': result.get('placeName', ''),
            'area': result.get('adminName2', '')  # You can use adminName2 as area/subdivision
        }

        return JsonResponse(location_info, safe=False)

    except Exception as e:
        return JsonResponse({'error': str(e)})
   
    
    
    
    
    
    
    
@csrf_exempt
def get_latest_appointment_for_patient(request):
    try:
        patient_id = request.GET.get('PatientId')
        latest_appointment = Patient_IP_Registration_Detials.objects.filter(PatientId=patient_id).order_by('-Registration_Id').first()

        if latest_appointment:
            appointment_data = {
                'Registration_Id': latest_appointment.Registration_Id,
                'VisitId': latest_appointment.VisitId,
            }

            return JsonResponse(appointment_data, safe=False)
        else:
            return JsonResponse({'error': 'No appointments found for this patient.'}, status=404)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)








#  For  Pharmacy Billing Op



def get_prescription(request):
    try:
        # Retrieve PatientID from request
        PatientID = request.GET.get('PatientID')
        print('PatientID :',PatientID)
        VisitID=request.GET.get('VisitID')
        # Check if PatientID is provided
        if not PatientID:
            return JsonResponse({"error": "PatientID parameter is required"}, status=400)

        # Fetch patient details to get the Patient Name
        patient = Patient_Detials.objects.get(PatientId=PatientID)
        PatientName = f"{patient.FirstName} {patient.MiddleName} {patient.SurName}"

        registration = Patient_Appointment_Registration_Detials.objects.get(
            PatientId_id =PatientID, VisitId=VisitID
        )



        # Query the prescriptions related to the PatientID
        prescriptions = Workbench_Prescription.objects.filter(
            Registration_Id_id =registration
        ).select_related('Doctor_Id', 'Registration_Id')

        # Prepare the list of prescriptions in the specified format
        prescription_list = []
        for prescription in prescriptions:
            registration = prescription.Registration_Id
            try:
                location = Location_Detials.objects.get(Location_Id=registration.Location_id)
                location_name = location.Location_Name
            except ObjectDoesNotExist:
                location_name = "N/A"
            
            doctor = prescription.Doctor_Id
            prescription_dict = {
                'PrescriptionID': prescription.Id,
                'PatientID': PatientID,
                'VisitID': registration.VisitId,
                'AppointmentDate': registration.created_at.date().isoformat(),  # or any other date field you want to use
                'DoctorName': f"{doctor.First_Name} {doctor.Last_Name}" if doctor else "N/A",
                'GenericName': prescription.GenericName,
                'ItemName': prescription.ItemName,
                'Dose': prescription.Dose,
                'Route': prescription.Route,
                'Frequency': prescription.Frequency,
                'Duration': f"{prescription.DurationNumber} {prescription.DurationUnit}",
                'Qty': prescription.Qty,
                'Instruction': prescription.Instruction,
                'Status': registration.Status,
                'LoggedBy': prescription.created_by,
                'Location': location_name,
                'CreatedAt': prescription.created_at.date().isoformat(),
                'Patient_Name': PatientName
            }
            prescription_list.append(prescription_dict)

        return JsonResponse(prescription_list, safe=False)

    except ObjectDoesNotExist:
        return JsonResponse({"error": "Patient not found"})
    except Exception as e:
        print('error:', str(e))
        return JsonResponse({"error": "Internal Server Error: " + str(e)})
    

    
def get_prescriptionqueue(request):
    try:
        # Fetch all prescriptions with related data
        prescriptions = Workbench_Prescription.objects.select_related(
            'Doctor_Id'  # Related doctor details
        ).all()

        # Serialize the prescriptions queryset to JSON
        serialized_prescriptions = serialize('json', prescriptions, use_natural_primary_keys=True)
        
        # Convert serialized data to Python dict
        serialized_data = json.loads(serialized_prescriptions)

        # Dictionary to hold unique patient details
        patient_data = {}
        
        id = 1
        # Enhance the serialized data with additional details
        for item in serialized_data:
            fields = item['fields']
            registration_id = fields.get('Registration_Id')
            doctor_id = fields.get('Doctor_Id')
            
            # Get PatientId using Registration_Id
            appointment = Patient_Appointment_Registration_Detials.objects.filter(id=registration_id).first()
            if appointment:
                patient_id = appointment.PatientId.PatientId
            else:
                patient_id = None
            
            if patient_id:
                if registration_id not in patient_data:
                    patient = Patient_Detials.objects.filter(PatientId=patient_id).first()
                    if patient:
                        # Fetch doctor details
                        doctor = Doctor_Personal_Form_Detials.objects.filter(Doctor_ID=doctor_id).first()
                        doctor_name = f"{doctor.First_Name} {doctor.Last_Name}" if doctor else ''
                        
                        patient_data[registration_id] = {
                            'Patient_Name': f"{patient.FirstName} {patient.MiddleName} {patient.SurName}",
                            'PatientPhoneNo': patient.PhoneNo,
                            'PatientEmail': patient.Email,
                            'PatientCity': patient.City,
                            'PatientState': patient.State,
                            'PatientCountry': patient.Country,
                            'VisitID': appointment.VisitId if appointment else '',
                            'DoctorName': doctor_name,
                            'id': id,
                            'PatientID': patient.PatientId 
                        }
            id += 1    
        # Convert patient data dictionary to list
        enhanced_data = list(patient_data.values())
        
        # Return the enhanced serialized data
        return JsonResponse(enhanced_data, safe=False)

    except Exception as e:
        print('error:', str(e))
        return JsonResponse({"error": "Internal Server Error: " + str(e)}, status=500)
    
    
    
@csrf_exempt
def get_personal_info(request):
    try:
        

        patientdata = Patient_Detials.objects.all()
        serialized_prescriptions = serialize('json', patientdata, use_natural_primary_keys=True)
        
        # Convert serialized data to Python dict
        serialized_data = json.loads(serialized_prescriptions)

        cleaned_data = [
            {
                **item['fields'],
                'PatientId': item['pk'] 
            }
            for item in serialized_data
        ]

        return JsonResponse(cleaned_data, safe=False)


    except Exception as e:
        print(e)
        return JsonResponse({'error': 'Internal Server Error: ' + str(e)},
                            status=500)
    

@csrf_exempt
def get_quick_list(request):
    try:
        # Get location id from query parameters
        location_id = request.GET.get('location')
        
        location = Location_Detials.objects.filter(Location_Id=location_id).first()

        if not location:
            return JsonResponse({'error': 'Location not found'}, status=404)

        stock_query = pharmacy_stock_location_information.objects.filter(Location=location.Location_Name)

        serialized_stock = serialize('json', stock_query, use_natural_primary_keys=True)
        
        serialized_data = json.loads(serialized_stock)
        
        cleaned_data = [
            {
                **item['fields']
            }
            for item in serialized_data
        ]

        return JsonResponse(cleaned_data, safe=False)

        
    except Exception as e:
        print(e)
        return JsonResponse({'error': 'Internal Server Error: ' + str(e)})
    
    
@csrf_exempt
def get_name(request):
    try:
        item_name = request.GET.get('ItemName')  
        batch_no = request.GET.get('BatchNo') 
        location = request.GET.get('location')  
        
        location = Location_Detials.objects.get(Location_Id=location)
        print('location :',location)
        if not location:
            return JsonResponse({'error': f'Location {location} not found'}, status=404)
        
        stock_query = pharmacy_stock_location_information.objects.filter(Location=location.Location_Name,Item_Name=item_name,Batch_No=batch_no)
       
        
        serialized_stock = serialize('json', stock_query, use_natural_primary_keys=True)
        # cleaned_data = [
        #     {
        #         **item['fields']
        #     }
        #     for item in serialized_stock
        # ]
        serialized_data = json.loads(serialized_stock)

        return JsonResponse(serialized_data, safe=False)
    
    except Exception as e:
        print(e)
        return JsonResponse({'error': 'Internal Server Error: ' + str(e)}, status=500)
    



# def get_prescription_forIP(request):
#     try:
#         # Retrieve PatientID from request
#         PatientID = request.GET.get('PatientID')
#         VisitID = request.GET.get('VisitID')

#         # Check if PatientID and VisitID are provided
#         if not PatientID:
#             return JsonResponse({"error": "PatientID parameter is required"}, status=400)
#         if not VisitID:
#             return JsonResponse({"error": "VisitID parameter is required"}, status=400)

#         # Fetch patient details to get the Patient Name
#         patient = Patient_Detials.objects.get(PatientId=PatientID)
#         PatientName = f"{patient.FirstName} {patient.MiddleName} {patient.SurName}"

#         # Query the prescriptions related to the VisitID (Registration_Id_id)
#         prescriptions = ip_drug_request_table.objects.filter(Booking_Id=VisitID)

#         # Prepare the list of prescriptions in the specified format
#         prescription_list = []
#         for prescription in prescriptions:
#             prescription_dict = {
#                 'PrescriptionID': prescription.Drug_Request_Id,
#                 'PatientID': PatientID,
#                 'VisitID': VisitID,  # Mapping VisitID as Registration_Id
#                 'Booking_Id': prescription.Booking_Id,
#                 # 'AppointmentDate': prescription.CreatedAt.date().isoformat(),  # Date of prescription creation
#                 'DoctorName': prescription.DoctorName,
#                 'GenericName': prescription.GenericName,
#                 'ItemName': prescription.MedicineName,
#                 'Dose': prescription.Dosage,
#                 'Route': prescription.Route,
#                 'Frequency': prescription.Duration,  # Assuming Frequency is in Duration
#                 'Duration': prescription.DurationType,
#                 'Qty': prescription.RequestQuantity,
#                 'Instruction': prescription.RequestType,  # Assuming RequestType includes instructions
#                 'Status': prescription.Status,
#                 'LoggedBy': prescription.CreatedBy,
#                 # 'CreatedAt': prescription.CreatedAt.date().isoformat(),
#                 'Patient_Name': PatientName
#             }
#             prescription_list.append(prescription_dict)

#         return JsonResponse(prescription_list, safe=False)

#     except Patient_Detials.DoesNotExist:
#         return JsonResponse({"error": "Patient not found"}, status=404)
#     except Exception as e:
#         print('error:', str(e))
#         return JsonResponse({"error": "Internal Server Error: " + str(e)}, status=500)



# from django.http import JsonResponse
# from django.views.decorators.csrf import csrf_exempt
# from django.db import connection

# @csrf_exempt
# def Post_Ip_PharmacyBilling_table(request):
#     if request.method == 'POST':
#         try:
#             # Extract prescription barcode from the form
#             prescription_barcode = request.POST.get('Priscription_Barcode', None)
            
#             # Extract medicines data
#             Billing_itemtable = []
#             index = 0
#             while True:
#                 item_id = request.POST.get(f'ItemId_{index}', None)
#                 quantity = request.POST.get(f'Billing_Quantity_{index}', None)
#                 if item_id is None and quantity is None:
#                     break
#                 Billing_itemtable.append({
#                     'ItemId': item_id,
#                     'Billing_Quantity': quantity
#                 })
#                 index += 1

#             # Database operations
#             with connection.cursor() as cursor:
#                 if prescription_barcode:
#                     # Update the status of the prescription barcode
#                     update_query_ip = """
#                         UPDATE Ip_Drug_Request_Table
#                         SET Status = 'Completed'
#                         WHERE Priscription_Barcode = %s
#                     """
#                     cursor.execute(update_query_ip, [prescription_barcode])

#                     # Update quantities for each medicine item
#                     for item in Billing_itemtable:
#                         item_id = item.get('ItemId')
#                         quantity = item.get('Billing_Quantity')
#                         if item_id and quantity is not None:
#                             update_query_item = """
#                                 UPDATE Ip_Drug_Request_Table
#                                 SET RecivedQuantity = %s
#                                 WHERE Priscription_Barcode = %s AND MedicineCode = %s
#                             """
#                             cursor.execute(update_query_item, [quantity, prescription_barcode, item_id])

#                     response_data = {'message': 'Data updated successfully'}
#                     return JsonResponse(response_data)
#                 else:
#                     return JsonResponse({'error': 'Prescription barcode is missing'}, status=400)

#         except Exception as e:
#             print(f"An error occurred: {str(e)}")
#             return JsonResponse({'error': 'An internal server error occurred'}, status=500)
#     else:
#         return JsonResponse({'error': 'Invalid request method'}, status=405)



@csrf_exempt
@require_http_methods(['POST'])
def Patient_details_register(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Extract RegisterData from the main request body
            register_data = data.get('RegisterData', {})

            patient_id = register_data.get('PatientId', '')
            phone_no = register_data.get('PhoneNo', '')
            title = register_data.get('Title', '')
            first_name = register_data.get('FirstName', '').strip()
            middle_name = register_data.get('MiddleName', '')
            sur_name = register_data.get('SurName', '')
            gender = register_data.get('Gender', '')
            dob = register_data.get('DOB', '')
            age = register_data.get('Age', '')
            email = register_data.get('Email', '')
            blood_group = register_data.get('BloodGroup', '')
            occupation = register_data.get('Occupation', '')
            religion = register_data.get('Religion', '')
            nationality = register_data.get('Nationality', '')
            unique_id_type = register_data.get('UniqueIdType', '')
            unique_id_no = register_data.get('UniqueIdNo', '')
            Location_Id = register_data.get('Location', None)
            visit_purpose = register_data.get('VisitPurpose', '')
            # case_sheet_no = register_data.get('CaseSheetNo', '')
            complaint = register_data.get('Complaint', '')
            patient_type = register_data.get('PatientType', '')
            patient_category = register_data.get('PatientCategory', '')

            # Address fields
            door_no = register_data.get('DoorNo', '')
            street = register_data.get('Street', '')
            area = register_data.get('Area', '')
            city = register_data.get('City', '')
            state = register_data.get('State', '')
            country = register_data.get('Country', '')
            pincode = register_data.get('Pincode', '')
            created_by = data.get('Created_by', '')

            print("2222222222", register_data)
            
            religion_instance = Religion_Detials.objects.get(Religion_Id=religion) if religion else None
            print("33333333333")
            title_instance = Title_Detials.objects.get(Title_Id=title) if title else None

            with transaction.atomic():
                print('4444444444')
                patient = None
                print('4444444444')

                # Check if patient with same PhoneNo and FirstName exists
                if Patient_Detials.objects.filter(PhoneNo=phone_no, FirstName=first_name).exists():
                    patient = Patient_Detials.objects.get(PhoneNo=phone_no, FirstName=first_name)
                    print('666666666')
                    return JsonResponse({'warn': f"The Patient {patient.PatientId} is already registered with {phone_no} and {first_name}"})
                
                print("555555555")

                # Create a new Patient_Detials object and save it
                patient_ins = Patient_Detials(
                    PhoneNo=phone_no,
                    Title=title,
                    FirstName=first_name,
                    MiddleName=middle_name, 
                    SurName=sur_name, 
                    Gender=gender, 
                    DOB=dob, 
                    Age=age, 
                    Email=email, 
                    BloodGroup=blood_group, 
                    Occupation=occupation, 
                    Religion=religion_instance, 
                    Nationality=nationality, 
                    UniqueIdType=unique_id_type, 
                    UniqueIdNo=unique_id_no, 
                    DoorNo=door_no, 
                    Street=street, 
                    Area=area, 
                    City=city, 
                    State=state, 
                    Country=country, 
                    Pincode=pincode, 
                    created_by=created_by
                )
                patient_ins.save()
                print('11111111', patient_ins)
                
                return JsonResponse({'success': 'Patient Details Added Successfully'})

        except Exception as e:
            return JsonResponse({'error': str(e)})

@csrf_exempt
@require_http_methods(['POST','GET'])
def IP_AdvanceAmount_collection(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            registration = data.get('RegistrationId')
            created_by = data.get('Created_by')
            Advanceamount = data.get('AdvanceAmount')

            print('1111111',data)

            Registration_ins = Patient_IP_Registration_Detials.objects.get(Registration_Id = registration)
            if not Advanceamount:
                return JsonResponse({'error': 'Enter the Advance Amount'})

            Advance_regis = Advance_Collection_IP(
                RegistrationId = Registration_ins,
                AdvanceAmount = Advanceamount,
                created_by = created_by,
            )
            Advance_regis.save()
            return JsonResponse({'success' : 'Advance Amount saved successfully'})
        except Exception as e:
            return JsonResponse({'error': str(e)})
        
    elif request.method == 'GET':
        try:
            registration = request.GET.get('RegistrationId')
            advance_ins = Advance_Collection_IP.objects.filter(RegistrationId=registration)
            remaining_cred = IP_Billing_Table_Detials.objects.filter(Register_Id__Registration_Id = registration)

            advance_total = []
            TotalAmount = 0

            # Loop through all filtered records
            for advance in advance_ins:
                TotalAmount += advance.AdvanceAmount
                advance_ip = {
                    'AdvanceAmount': advance.AdvanceAmount,
                    'Date': advance.created_at.strftime('%Y-%m-%d'),  # Fixing inconsistent key
                    'Time': advance.created_at.strftime('%H:%M:%S'),  # Fixing inconsistent key
                    'ReceivedBy': advance.created_by,  # Fixed typo
                    'TotalAmount': TotalAmount,       # Running total
                }
                advance_total.append(advance_ip)  # Append in each iteration

            # Adding the Total Advance Amount to the response
            total_advance_amount = advance_ins.aggregate(total=Sum('AdvanceAmount'))['total'] or 0
            total_paid_amount = remaining_cred.aggregate(totalpaid = Sum('Paid_Amount'))['totalpaid'] or 0
            response_data = {
                'AdvanceDetails': advance_total,
                'TotalAdvanceAmount': total_advance_amount,
                'TotalPaidAmount': total_paid_amount,
                'RemainingCredit' : total_advance_amount-total_paid_amount,
            }

            return JsonResponse(response_data, safe=False)
        except Exception as e:
            return JsonResponse({'error': str(e)})


@csrf_exempt
def get_overall_advance_details(request):
    if request.method == 'GET':
        try:
            advance_ins = Advance_Collection_IP.objects.all()
            
            advance_total = []
            TotalAmount = 0
            # Loop through all filtered records
            for advance in advance_ins:
                TotalAmount += advance.AdvanceAmount
                advance_ip = {
                    'PatientId':advance.RegistrationId.PatientId.PatientId,
                    'PatientName': f'''{advance.RegistrationId.PatientId.Title.Title_Name}.{advance.RegistrationId.PatientId.FirstName} {advance.RegistrationId.PatientId.MiddleName} {advance.RegistrationId.PatientId.SurName}''' if advance.RegistrationId.PatientId.FirstName else None,
                    'RegistrationId':advance.RegistrationId.Registration_Id,
                    'PhoneNo': advance.RegistrationId.PatientId.PhoneNo,
                    'AdvanceAmount': advance.AdvanceAmount,
                    'Date': advance.created_at.strftime('%Y-%m-%d'),  # Fixing inconsistent key
                    'Time': advance.created_at.strftime('%H:%M:%S'),  # Fixing inconsistent key
                    'ReceivedBy': advance.created_by,  # Fixed typo
                    'TotalAmount': TotalAmount,       # Running total
                }
                advance_total.append(advance_ip)  # Append in each iteration

            # Adding the Total Advance Amount to the response
            total_advance_amount = advance_ins.aggregate(total=Sum('AdvanceAmount'))['total'] or 0
            response_data = {
                'AdvanceDetails': advance_total,
                'TotalAdvanceAmount': total_advance_amount,
            }
            return JsonResponse(response_data,safe=False)
        except Exception as e:
            return JsonResponse({'error':str(e)})