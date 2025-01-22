from django.db.models.signals import post_save, post_delete, post_migrate
from django.dispatch import receiver
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User

from HR_Management.models import *
from .models import *
from django.http import JsonResponse

from Finance.models import (Finance_NatureOfGroup_Detailes, 
Finance_GroupMaster_Detailes,Finance_LedgerMasters_Detailes)




@receiver(post_migrate)
def create_default_superadmin(sender, **kwargs):
    if sender.name == 'Masters':  # Replace with the name of your app
        # Check if the admin user already exists
        if not User.objects.filter(username='host').exists():
            superadmin_role, created = Role_Master.objects.get_or_create(
                Role_Name='host',
                defaults={'created_by': 'system'},
                created_by= 'system'
            )

            Title_instance ,created =Title_Detials.objects.get_or_create(
                Title_Name = 'Mr',
                created_by= 'system'
            )

            employee_instance, created = Employee_Personal_Form_Detials.objects.get_or_create(
                Employee_ID='CRTEMPL001',
                defaults={
                    'Tittle':Title_instance,
                    'First_Name': 'Vesoft',
                    'Middle_Name': 'Private',
                    'Last_Name': 'Limited',
                    'Gender': 'Male',
                    'DOB': '1999-01-01',
                    'Age': '25',
                    'Marital_Status': 'Single',
                    'E_mail': 'vesoft@gmail.com',
                    'Contact_Number': '8657867876',
                    'created_by': 'system'
                }
            )

            # Create a superuser
            superadmin = User.objects.create_superuser(
                username='host',
                first_name='Vesoft',
                last_name='Vesoft',
                email='vesoft@gmail.com',   
                password="host",  
                is_staff=True,
                is_active=True,
                date_joined='2024-09-09'
            )




            useradmin = UserRegister_Master_Details.objects.create(
                auth_user_id=superadmin,  # Correct the field name to match the ForeignKey in your model
                EmployeeType='EMPLOYEE',
                Doctor_Id=None,
                Employee_Id=employee_instance,
                role=superadmin_role,
                Access='A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U',
                created_by='system',
                SubAccess='A1-1,A1-2,A1-3,A1-4,A1-5,A1-6,A1-7,A1-8,A1-9,A1-10,A1-11,A1-12,A1-13,A1-14,A1-15,A1-16,A1-17,A1-18,A1-19,A1-20,B2-1,B2-2,B2-3,B2-4,B2-5,B2-6,B2-7,C3-1,C3-2,C3-3,D4-1,D4-2,D4-3,E5-1,E5-2,E5-3,E5-4,F6-1,F6-2,F6-3,F6-4,G7-1,G7-2,G7-3, H8-1,H8-2,H8-3,H8-4,H8-5,H8-6,H8-7,I9-1,I9-2,I9-3,I9-4,I9-5,I9-6,I9-7,I9-8,I9-9,I9-10,I9-11,I9-12,I9-13,I9-14,I9-15,I9-16,I9-17,I9-18,I9-19,J10-1,J10-2,J10-3,J10-4,J10-5,J10-6,J10-7,J10-8,J10-9,J10-10,J10-11,J10-12,J10-13,J10-14,J10-15,J10-16,J10-17,J10-18,J10-19,J10-20,J10-21,J10-22,J10-23,J10-24,K11-1,K11-2,K11-3,K11-4,K11-5,K11-6,K11-7,K11-8,K11-9,K11-10,K11-11,K11-12,K11-13,K11-14,K11-15,K11-16,K11-17,K11-18,K11-19,K11-20,K11-21,K11-22,K-23,L12-1,L12-2,L12-3,M13-1,M13-2,M13-3,M13-4,M13-5,M13-6,M13-7,M13-8,M13-9, N14-1,N14-2,N14-3,N14-4,N14-5,N14-6,N14-7,N14-8,O15-1,O15-2,O15-3,O15-4,O15-5,O15-6,O15-7,O15-8,P16-1,P16-2,P16-3,P16-4,P16-5,Q17-1,Q17-2,Q17-3,Q17-4,Q17-5,Q17-6,Q17-7,Q17-8,Q17-9,Q17-10,Q17-11,Q17-12,Q17-13,Q17-14,Q17-15,Q17-16,Q17-17,R18-1,R18-2,S19-1,S19-2,S19-3,S19-4,S19-5,S19-6,S19-7,S19-8,S19-9,S19-10,S19-11,S19-12,S19-13,S19-14,U21-1,U21-2,U21-3,U21-4,U21-5'
            )

            # Create default locations
            default_locations = [
                {'Location_Name': 'TRICHY', 'Bed_Count': 100, 'Status': True, 'created_by': 'system'},
            ]
            location_instances = [Location_Detials.objects.create(**loc) for loc in default_locations]

            # Associate default locations with the superadmin user
            useradmin.Locations.set(location_instances)
            useradmin.save()
            
            api=credentialapi.objects.create(
                token_id='11b8e78a-77f7-4a11-bf8e-48c783214ded',
                password_hash='3d5d76e8c735de0251ec20c9277cf1faa77c3b04615fabb7f4acdee11134f30e'
            )
            api.save()

            # Create default building, block, floor, and wards
            building_ins = Building_Master_Detials.objects.create(
                Building_Name='BUILDINGA',
                Location_Name=location_instances[0],
                created_by='host'
            )
            block_ins = Block_Master_Detials.objects.create(
                Block_Name='BLOCKA',
                Building_Name=building_ins,
                Location_Name=building_ins.Location_Name,
                created_by='host'
            )
            floor_ins = Floor_Master_Detials.objects.create(
                Floor_Name='FLOOR1',
                Block_Name=block_ins,
                Building_Name=block_ins.Building_Name,
                Location_Name=block_ins.Location_Name,
                created_by='host'
            )
            for ward in ['GENERAL', 'ICU', 'CASUALITY', 'OT']:
                WardType_Master_Detials.objects.create(
                    Location_Name=block_ins.Location_Name,
                    Building_Name=block_ins.Building_Name,
                    Block_Name=block_ins,
                    Floor_Name=floor_ins,
                    Ward_Name=ward,
                    created_by='host'
                )
            for rel in ['HINDU', 'MUSLIM', 'CRISTIAN']:
                Religion_Detials.objects.create(
                    Religion_Name=rel,
                    created_by='host'
                )
            for dep in ['IP', 'OP']:
                Department_Detials.objects.create(
                    Department_Name=dep,
                    created_by='host'
                )
            for des in ['DOCTOR', 'NURSE']:
                designation_ins = Designation_Detials.objects.create(
                    Designation_Name=des,
                    created_by='host'
                )
                if des == 'DOCTOR':
                    for spec in ['GENERAL MEDICINE']:
                        Speciality_Detials.objects.create(
                            Designation_Name=designation_ins,
                            Speciality_Name=spec,
                            created_by='host'
                        )
                    for cat in ['JUNIOR', 'SENIOR', 'JUNIOR-SURGEON', 'SENIOR-SURGEON']:
                        Category_Detials.objects.create(
                            Designation_Name=designation_ins,
                            Category_Name=cat,
                            created_by='host'
                        )
            Flaggcolor_Detials.objects.create(
                Flagg_Name='GENERAL',
                Flagg_Color='#fff',
                created_by='host'
            )
            default_TriageCategory = [
                {'Category': 'Immediate','Description':'Life-threatening injuries', 'Colour':'#FF0000','created_by':'host'},
                {'Category': 'Delayed','Description':'Serious injuries', 'Colour':'#FFFF00','created_by':'host'},
                {'Category': 'Minor','Description':'Non-urgent injuries', 'Colour':'#008000','created_by':'host'},
                {'Category': 'Deceased/Expectant','Description':'No chance of survival ', 'Colour':'#000000','created_by':'host'},
                {'Category': 'Dismissed','Description':'No injuries or minor issues', 'Colour':'#FFFFFF','created_by':'host'},
                {'Category': 'Observation','Description':'continued observation', 'Colour':'#FFA500','created_by':'host'},
                {'Category': 'Expectant/Palliative','Description':'comfort care', 'Colour':'#0000FF','created_by':'host'},
                {'Category': 'Contaminated/Hazmat','Description':'contaminated with hazardous materials', 'Colour':'#800080','created_by':'host'},
                {'Category': 'Psychological','Description':'psychological distress', 'Colour':'#FFC0CB','created_by':'host'},
                {'Category': 'Hold/Temporary Delay','Description':'stable and can wait for a longer period', 'Colour':'#808080','created_by':'host'},
            ]
 
            for Triage in default_TriageCategory:
                TriageCategory_Detials.objects.create(
                    Category=Triage['Category'],
                    Description=Triage['Description'],
                    Colour=Triage['Colour'],
                    created_by=Triage['created_by']
            )

            nature_of_group_list = [
                {'NatureOfGroupName': 'Assets', 'created_by': 'host'},
                {'NatureOfGroupName': 'Expenses', 'created_by': 'host'},
                {'NatureOfGroupName': 'Income', 'created_by': 'host'},
                {'NatureOfGroupName': 'Liabilities', 'created_by': 'host'},
            ]

            for item in nature_of_group_list:
                Finance_NatureOfGroup_Detailes.objects.get_or_create(
                    NatureOfGroupName=item['NatureOfGroupName'],
                    defaults={'created_by': item['created_by']}
                )

            prime_group_list = [
                
                {'GroupName': 'Capital Account', 'TypeOfGroup':'Prime','NatureOfGroup': 'Liabilities', 'created_by': 'host'},
                {'GroupName': 'Current Assets','TypeOfGroup':'Prime', 'NatureOfGroup': 'Assets', 'created_by': 'host'},
                {'GroupName': 'Current Liabilities','TypeOfGroup':'Prime', 'NatureOfGroup': 'Liabilities', 'created_by': 'host'},
                {'GroupName': 'Direct Expenses','TypeOfGroup':'Prime', 'NatureOfGroup': 'Expenses', 'created_by': 'host'},
                {'GroupName': 'Direct Incomes','TypeOfGroup':'Prime', 'NatureOfGroup': 'Income', 'created_by': 'host'},
                {'GroupName': 'Fixed Assets','TypeOfGroup':'Prime', 'NatureOfGroup': 'Assets', 'created_by': 'host'},
                {'GroupName': 'Indirect Expenses','TypeOfGroup':'Prime', 'NatureOfGroup': 'Expenses', 'created_by': 'host'},
                {'GroupName': 'Indirect Incomes','TypeOfGroup':'Prime', 'NatureOfGroup': 'Income', 'created_by': 'host'},
                {'GroupName': 'Investments', 'TypeOfGroup':'Prime','NatureOfGroup': 'Assets', 'created_by': 'host'},
                {'GroupName': 'Loans(Liability)','TypeOfGroup':'Prime', 'NatureOfGroup': 'Liabilities', 'created_by': 'host'},
                {'GroupName': 'Purchase Accounts','TypeOfGroup':'Prime', 'NatureOfGroup': 'Expenses', 'created_by': 'host'},
                {'GroupName': 'Sales Accounts','TypeOfGroup':'Prime', 'NatureOfGroup': 'Income', 'created_by': 'host'},
            ]

            for group in prime_group_list:
                nature_of_group = Finance_NatureOfGroup_Detailes.objects.get(NatureOfGroupName=group['NatureOfGroup'])
                Finance_GroupMaster_Detailes.objects.get_or_create(
                    GroupName=group['GroupName'],
                    defaults={
                        'NatureOfGroup': nature_of_group,
                        'TypeofGroup':group['TypeOfGroup'],
                        'ParentGroup': None, 
                        'created_by': group['created_by']
                    }
                )
            
            sub_group_list=[
                {'GroupName': 'Reserves & Suplus', 'TypeOfGroup':'Sub','UnderGroup': 'Capital Account', 'created_by': 'host'},
                {'GroupName': 'Bank Accounts', 'TypeOfGroup':'Sub','UnderGroup': 'Current Assets', 'created_by': 'host'},
                {'GroupName': 'Cash-in-Hand','TypeOfGroup':'Sub', 'UnderGroup': 'Current Assets', 'created_by': 'host'},
                {'GroupName': 'Deposits(Asset)', 'TypeOfGroup':'Sub','UnderGroup': 'Current Assets', 'created_by': 'host'},
                {'GroupName': 'Loans & Advances (Asset)','TypeOfGroup':'Sub', 'UnderGroup': 'Current Assets', 'created_by': 'host'},
                {'GroupName': 'Stock-in-Hand','TypeOfGroup':'Sub', 'UnderGroup': 'Current Assets', 'created_by': 'host'},
                {'GroupName': 'Sundry Debtors', 'TypeOfGroup':'Sub','UnderGroup': 'Current Assets', 'created_by': 'host'},
                {'GroupName': 'Duties & Taxes', 'TypeOfGroup':'Sub','UnderGroup': 'Current Liabilities', 'created_by': 'host'},
                {'GroupName': 'Provisions', 'TypeOfGroup':'Sub','UnderGroup': 'Current Liabilities', 'created_by': 'host'},
                {'GroupName': 'Sundry Creditors', 'TypeOfGroup':'Sub','UnderGroup': 'Current Liabilities', 'created_by': 'host'},
                {'GroupName': 'Bank OD A/c', 'TypeOfGroup':'Sub','UnderGroup': 'Loans(Liability)', 'created_by': 'host'},
                {'GroupName': 'Secured Loans', 'TypeOfGroup':'Sub','UnderGroup': 'Loans(Liability)', 'created_by': 'host'},
                {'GroupName': 'Unsecured Loans','TypeOfGroup':'Sub', 'UnderGroup': 'Loans(Liability)', 'created_by': 'host'}

            ]

            for subgroup in sub_group_list:
                parent_group = Finance_GroupMaster_Detailes.objects.get(GroupName=subgroup['UnderGroup'])
                Finance_GroupMaster_Detailes.objects.get_or_create(
                    GroupName=subgroup['GroupName'],
                    defaults={
                        'NatureOfGroup': parent_group.NatureOfGroup, 
                        'TypeofGroup':subgroup['TypeOfGroup'], 
                        'ParentGroup': parent_group,  
                        'created_by': subgroup['created_by']
                    }
                )   
            finance_ledger_list=[
                {'LedgerName':'Cash','LedgerGroupName': 'Current Assets','OpeningBalance':0,'DebitOrCredit':'Dr','created_by': 'host'},
                {'LedgerName':'Bank','LedgerGroupName': 'Bank Accounts','OpeningBalance':0,'DebitOrCredit':'Dr','created_by': 'host'},
            ]

            for ledger in finance_ledger_list:
                GroupMaster_ins=Finance_GroupMaster_Detailes.objects.get(GroupName=ledger['LedgerGroupName'])
                Finance_LedgerMasters_Detailes.objects.get_or_create(
                    LedgerName=ledger['LedgerName'],
                    LedgerGroupName=GroupMaster_ins,
                    OpeningBalance=ledger['OpeningBalance'],
                    DebitOrCredit=ledger['DebitOrCredit'],
                    created_by=ledger['created_by']
                )
               

   

@receiver(post_save, sender=Location_Detials)
def add_location_to_superadmin(sender, instance, created, **kwargs):
    if created:
        # Add service and procedure charges for the new location
        for ins in Service_Master_Details.objects.all():
            Service_Procedure_Charges.objects.get_or_create(
                MasterType='Service',
                Service_ratecard=ins,
                Procedure_ratecard=None,
                Location=instance,
            )
        for ins in Procedure_Master_Details.objects.all():
            Service_Procedure_Charges.objects.get_or_create(
                MasterType='Procedure',
                Service_ratecard=None,
                Procedure_ratecard=ins,
                Location=instance,
            )

        # Add the new location to the superadmin
        try:
            superadmin = UserRegister_Master_Details.objects.get(auth_user_id__username='host')
            superadmin.Locations.add(instance)
        except UserRegister_Master_Details.DoesNotExist:
            pass

@receiver(post_save, sender=Doctor_Personal_Form_Detials)
def create_doctor_ratecard(sender, instance, created, **kwargs):
    if created and instance.DoctorType != 'Referral':
        doctor_ratecard = Doctor_Ratecard_Master.objects.create(
            Doctor_ID=instance,
        )
        for room in RoomType_Master_Detials.objects.all():
            room_type_fee, _ = RoomTypeFee.objects.get_or_create(
                doctor_ratecard=doctor_ratecard,
                room_type=room,
            )
            for insurance in Insurance_Master_Detials.objects.all():
                InsuranceRoomTypeFee.objects.get_or_create(
                    doctor_ratecard=doctor_ratecard,
                    room_type_fee=room_type_fee,
                    insurance=insurance
                )
            for client in Client_Master_Detials.objects.all():
                ClientRoomTypeFee.objects.get_or_create(
                    doctor_ratecard=doctor_ratecard,
                    room_type_fee=room_type_fee,
                    client=client
                )
            for corporate in Corporate_Master_Detials.objects.all():
                CorporateRoomTypeFee.objects.get_or_create(
                    doctor_ratecard=doctor_ratecard,
                    room_type_fee=room_type_fee,
                    corporate=corporate
                    
                )
        for insurance in Insurance_Master_Detials.objects.all():
            InsuranceFee.objects.get_or_create(
                doctor_ratecard=doctor_ratecard,
                insurance=insurance
            )
        for client in Client_Master_Detials.objects.all():
            ClientFee.objects.get_or_create(
                doctor_ratecard=doctor_ratecard,
                client=client
            )
        for corporate in Corporate_Master_Detials.objects.all():
            CorporateFee.objects.get_or_create(
                doctor_ratecard=doctor_ratecard,
                corporate=corporate
                
            )
     
     
            
@receiver(post_save, sender=RoomType_Master_Detials)
def create_room_type_fee(sender, instance, created, **kwargs):
    if created:
        for doctor_ratecard in Doctor_Ratecard_Master.objects.all():
            room_type_fee, _ = RoomTypeFee.objects.get_or_create(
                doctor_ratecard=doctor_ratecard,
                room_type=instance,
            )
            for insurance in Insurance_Master_Detials.objects.all():
                InsuranceRoomTypeFee.objects.get_or_create(
                    doctor_ratecard=doctor_ratecard,
                    room_type_fee=room_type_fee,
                    insurance=insurance
                )
            for client in Client_Master_Detials.objects.all():
                ClientRoomTypeFee.objects.get_or_create(
                    doctor_ratecard=doctor_ratecard,
                    room_type_fee=room_type_fee,
                    client=client
                )
            for corporate in Corporate_Master_Detials.objects.all():
                CorporateRoomTypeFee.objects.get_or_create(
                    doctor_ratecard=doctor_ratecard,
                    room_type_fee=room_type_fee,
                    corporate=corporate
                    
                )
                
        for ratecard in Service_Procedure_Charges.objects.all():
            if ratecard.MasterType== 'Service':
                if ratecard.Service_ratecard.Department !='OP':
                    room_type_fee, _ = Service_Procedure_RoomTypeFee.objects.get_or_create(
                        Service_Procedure_ratecard=ratecard,
                        room_type=instance,
                        General_fee=ratecard.Service_ratecard.Amount,
                        Special_fee=ratecard.Service_ratecard.Amount,
                    )
                    for insurance in Insurance_Master_Detials.objects.all():
                        Service_Procedure_InsuranceRoomTypeFee.objects.get_or_create(
                            Service_Procedure_ratecard=ratecard,
                            room_type_fee=instance,
                            insurance=insurance,
                            fee=ratecard.Service_ratecard.Amount,
                        )
                    for client in Client_Master_Detials.objects.all():
                        Service_Procedure_ClientRoomTypeFee.objects.get_or_create(
                            Service_Procedure_ratecard=ratecard,
                            room_type_fee=instance,
                            client=client,
                            fee=ratecard.Service_ratecard.Amount,
                            
                        )
                    for corporate in Corporate_Master_Detials.objects.all():
                        Service_Procedure_CorporateRoomTypeFee.objects.get_or_create(
                            Service_Procedure_ratecard=ratecard,
                            room_type_fee=instance,
                            corporate=corporate,
                            fee=ratecard.Service_ratecard.Amount,
                            
                        )
                        
            else:
                room_type_fee, _ = Service_Procedure_RoomTypeFee.objects.get_or_create(
                    Service_Procedure_ratecard=ratecard,
                    room_type=instance,
                    General_fee=ratecard.Procedure_ratecard.Amount,
                    Special_fee=ratecard.Procedure_ratecard.Amount,
                )
                for insurance in Insurance_Master_Detials.objects.all():
                    Service_Procedure_InsuranceRoomTypeFee.objects.get_or_create(
                        Service_Procedure_ratecard=ratecard,
                        room_type_fee=instance,
                        insurance=insurance,
                        fee=ratecard.Procedure_ratecard.Amount,
                    )
                for client in Client_Master_Detials.objects.all():
                    Service_Procedure_ClientRoomTypeFee.objects.get_or_create(
                        Service_Procedure_ratecard=ratecard,
                        room_type_fee=instance,
                        client=client,
                        fee=ratecard.Procedure_ratecard.Amount,
                        
                    )
                for corporate in Corporate_Master_Detials.objects.all():
                    Service_Procedure_CorporateRoomTypeFee.objects.get_or_create(
                        Service_Procedure_ratecard=ratecard,
                        room_type_fee=instance,
                        corporate=corporate,
                        fee=ratecard.Procedure_ratecard.Amount,
                    )
                    
                
@receiver(post_save, sender=Insurance_Master_Detials)
def create_insurance_fee(sender, instance, created, **kwargs):
    if created:
        for doctor_ratecard in Doctor_Ratecard_Master.objects.all():
            InsuranceFee.objects.get_or_create(
                doctor_ratecard=doctor_ratecard,
                insurance=instance,
            )
        for room_type_fee in RoomTypeFee.objects.all():
            InsuranceRoomTypeFee.objects.get_or_create(
                doctor_ratecard=room_type_fee.doctor_ratecard,
                room_type_fee=room_type_fee,
                insurance=instance
            )
        for ratecard in Service_Procedure_Charges.objects.all():
            if ratecard.MasterType=='Service':
                if ratecard.Service_ratecard.Department != 'IP':
                    Service_Procedure_InsuranceFee.objects.get_or_create(
                        Service_Procedure_ratecard=ratecard,
                        insurance=instance,
                        fee=ratecard.Service_ratecard.Amount,
                    )
                    
                    
            else:
                Service_Procedure_InsuranceFee.objects.get_or_create(
                        Service_Procedure_ratecard=ratecard,
                        insurance=instance,
                        fee=ratecard.Procedure_ratecard.Amount,
                        
                    )
        for room_type_fee in Service_Procedure_RoomTypeFee.objects.all():
            if room_type_fee.Service_Procedure_ratecard.MasterType=='Service':
                if room_type_fee.Service_Procedure_ratecard.Service_ratecard.Department != 'OP':
                    Service_Procedure_InsuranceRoomTypeFee.objects.get_or_create(
                        Service_Procedure_ratecard=room_type_fee.Service_Procedure_ratecard,
                        room_type_fee=room_type_fee.room_type,
                        insurance=instance,
                        fee=room_type_fee.Service_Procedure_ratecard.Service_ratecard.Amount
                    )
            else:
                Service_Procedure_InsuranceRoomTypeFee.objects.get_or_create(
                    Service_Procedure_ratecard=room_type_fee.Service_Procedure_ratecard,
                    room_type_fee=room_type_fee.room_type,
                    insurance=instance,
                    fee=room_type_fee.Service_Procedure_ratecard.Procedure_ratecard.Amount
                    
                )

@receiver(post_save, sender=Client_Master_Detials)
def create_client_fee(sender, instance, created, **kwargs):
    if created:
        for doctor_ratecard in Doctor_Ratecard_Master.objects.all():
            ClientFee.objects.get_or_create(
                doctor_ratecard=doctor_ratecard,
                client=instance,
            )
        for room_type_fee in RoomTypeFee.objects.all():
            ClientRoomTypeFee.objects.get_or_create(
                doctor_ratecard=room_type_fee.doctor_ratecard,
                room_type_fee=room_type_fee,
                client=instance
            )
        for ratecard in Service_Procedure_Charges.objects.all():
            if ratecard.MasterType=='Service':
                if ratecard.Service_ratecard.Department != 'IP':
                    Service_Procedure_ClientFee.objects.get_or_create(
                        Service_Procedure_ratecard=ratecard,
                        client=instance,
                        fee=ratecard.Service_ratecard.Amount,
                        
                    )
                   
            else:
                Service_Procedure_ClientFee.objects.get_or_create(
                    Service_Procedure_ratecard=ratecard,
                    client=instance,
                    fee=ratecard.Procedure_ratecard.Amount,
                    
                )
        for room_type_fee in Service_Procedure_RoomTypeFee.objects.all():
            if room_type_fee.Service_Procedure_ratecard.MasterType=='Service':
                if room_type_fee.Service_Procedure_ratecard.Service_ratecard.Department != 'OP':
                    Service_Procedure_ClientRoomTypeFee.objects.get_or_create(
                        Service_Procedure_ratecard=room_type_fee.Service_Procedure_ratecard,
                        room_type_fee=room_type_fee.room_type,
                        client=instance,
                        fee=room_type_fee.Service_Procedure_ratecard.Service_ratecard.Amount
                        
                    )
            else:
                Service_Procedure_ClientRoomTypeFee.objects.get_or_create(
                    Service_Procedure_ratecard=room_type_fee.Service_Procedure_ratecard,
                    room_type_fee=room_type_fee.room_type,
                    client=instance,
                    fee=room_type_fee.Service_Procedure_ratecard.Procedure_ratecard.Amount
                    
                )


@receiver(post_save, sender=Corporate_Master_Detials)
def create_corporate_fee(sender, instance, created, **kwargs):
    if created:
        for doctor_ratecard in Doctor_Ratecard_Master.objects.all():
            CorporateFee.objects.get_or_create(
                doctor_ratecard=doctor_ratecard,
                corporate=instance,     
            )
        for room_type_fee in RoomTypeFee.objects.all():
            CorporateRoomTypeFee.objects.get_or_create(
                doctor_ratecard=room_type_fee.doctor_ratecard,
                room_type_fee=room_type_fee,
                corporate=instance
            )
        for ratecard in Service_Procedure_Charges.objects.all():
            if ratecard.MasterType=='Service':
                if ratecard.Service_ratecard.Department != 'IP':
                    Service_Procedure_CorporateFee.objects.get_or_create(
                        Service_Procedure_ratecard=ratecard,
                        corporate=instance,
                        fee=ratecard.Service_ratecard.Amount,
                    )
                else:
                    Service_Procedure_CorporateFee.objects.get_or_create(
                        Service_Procedure_ratecard=ratecard,
                        corporate=instance,
                        fee=ratecard.Procedure_ratecard.Amount,
                    )
            for room_type_fee in Service_Procedure_RoomTypeFee.objects.all():
                if room_type_fee.Service_Procedure_ratecard.MasterType=='Service':
                    if room_type_fee.Service_Procedure_ratecard.Service_ratecard.Department != 'OP':
                        Service_Procedure_CorporateRoomTypeFee.objects.get_or_create(
                            Service_Procedure_ratecard=room_type_fee.Service_Procedure_ratecard,
                            room_type_fee=room_type_fee.room_type,
                            corporate=instance,
                            fee=room_type_fee.Service_Procedure_ratecard.Service_ratecard.Amount         
                        )
                    else:
                        Service_Procedure_CorporateRoomTypeFee.objects.get_or_create(
                            Service_Procedure_ratecard=room_type_fee.Service_Procedure_ratecard,
                            room_type_fee=room_type_fee.room_type,
                            corporate=instance,
                            fee=room_type_fee.Service_Procedure_ratecard.Procedure_ratecard.Amount
                            
                        )                        
                            
                 
                    
                
                    
                           
                        
                    
                
# bharathi      
                
# Service Procedure Master Signals

@receiver(post_save, sender=Service_Master_Details)
def create_service_procedure_charges(sender, instance, created, **kwargs):
    if created:
        locations = Location_Detials.objects.all()
        for location in locations:
            Service_Procedure_Charges.objects.get_or_create(
                MasterType='Service',
                Service_ratecard=instance,
                Procedure_ratecard=None,
                Location=location,
            )

@receiver(post_save, sender=Procedure_Master_Details)
def create_procedure_procedure_charges(sender, instance, created, **kwargs):
    if created:
        locations = Location_Detials.objects.all()
        for location in locations:
            Service_Procedure_Charges.objects.get_or_create(
                MasterType='Procedure',
                Service_ratecard=None,
                Procedure_ratecard=instance,
                Location=location,
            )

@receiver(post_save, sender=Service_Procedure_Charges)
def create_service_procedure_related_fees(sender, instance, created, **kwargs):
    if created:

        if instance.MasterType=='Service':
            if instance.Service_ratecard.Department=='IP':
                for room in RoomType_Master_Detials.objects.all():
                    room_type_fee, _ = Service_Procedure_RoomTypeFee.objects.get_or_create(
                        Service_Procedure_ratecard=instance,
                        room_type=room,
                        General_fee=instance.Service_ratecard.Amount,
                        Special_fee=instance.Service_ratecard.Amount,
                    )
                    for insurance in Insurance_Master_Detials.objects.all():
                        Service_Procedure_InsuranceRoomTypeFee.objects.get_or_create(
                            Service_Procedure_ratecard=instance,
                            room_type_fee=room,
                            insurance=insurance,
                            fee=instance.Service_ratecard.Amount,
                        )
                    for client in Client_Master_Detials.objects.all():
                        Service_Procedure_ClientRoomTypeFee.objects.get_or_create(
                            Service_Procedure_ratecard=instance,
                            room_type_fee=room,
                            client=client,
                            fee=instance.Service_ratecard.Amount,
                        )
                    for corporate in Corporate_Master_Detials.objects.all():
                        Service_Procedure_CorporateRoomTypeFee.objects.get_or_create(
                            Service_Procedure_ratecard=instance,
                            room_type_fee=room,
                            corporate=corporate,
                            fee=instance.Service_ratecard.Amount,     
                        )
                        
            elif instance.Service_ratecard.Department=='OP':
                Service_Procedure_Rate_Charges.objects.create(
                    Service_Procedure_ratecard=instance,
                    General_fee=instance.Service_ratecard.Amount,
                    Special_fee=instance.Service_ratecard.Amount,
                )
                for insurance in Insurance_Master_Detials.objects.all():
                    Service_Procedure_InsuranceFee.objects.get_or_create(
                        Service_Procedure_ratecard=instance,
                        insurance=insurance,
                        fee=instance.Service_ratecard.Amount,
                    )
                for client in Client_Master_Detials.objects.all():
                    Service_Procedure_ClientFee.objects.get_or_create(
                        Service_Procedure_ratecard=instance,
                        client=client,
                        fee=instance.Service_ratecard.Amount,
                    )
                for corporate in Corporate_Master_Detials.objects.all():
                    Service_Procedure_CorporateFee.objects.get_or_create(
                        Service_Procedure_ratecard=instance,
                        corporate=corporate,
                        fee=instance.Service_ratecard.Amount,
                    )
            else:
                Service_Procedure_Rate_Charges.objects.create(
                    Service_Procedure_ratecard=instance
                )
                for room in RoomType_Master_Detials.objects.all():
                    room_type_fee, _ = Service_Procedure_RoomTypeFee.objects.get_or_create(
                        Service_Procedure_ratecard=instance,
                        room_type=room,
                        General_fee=instance.Service_ratecard.Amount,
                        Special_fee=instance.Service_ratecard.Amount,
                    )
                    for insurance in Insurance_Master_Detials.objects.all():
                        Service_Procedure_InsuranceRoomTypeFee.objects.get_or_create(
                            Service_Procedure_ratecard=instance,
                            room_type_fee=room,
                            insurance=insurance,
                            fee=instance.Service_ratecard.Amount,
                        )
                    for client in Client_Master_Detials.objects.all():
                        Service_Procedure_ClientRoomTypeFee.objects.get_or_create(
                            Service_Procedure_ratecard=instance,
                            room_type_fee=room,
                            client=client,
                            fee=instance.Service_ratecard.Amount,
                        )
                    for corporate in Corporate_Master_Detials.objects.all():
                        Service_Procedure_CorporateRoomTypeFee.objects.get_or_create(
                            Service_Procedure_ratecard=instance,
                            room_type_fee=room,
                            corporate=corporate,
                            fee=instance.Service_ratecard.Amount,
                        )
                        
                for insurance in Insurance_Master_Detials.objects.all():
                    Service_Procedure_InsuranceFee.objects.get_or_create(
                        Service_Procedure_ratecard=instance,
                        insurance=insurance,
                        fee=instance.Service_ratecard.Amount,
                    )
                for client in Client_Master_Detials.objects.all():
                    Service_Procedure_ClientFee.objects.get_or_create(
                        Service_Procedure_ratecard=instance,
                        client=client,
                        fee=instance.Service_ratecard.Amount,
                    )
                for corporate in Corporate_Master_Detials.objects.all():
                    Service_Procedure_CorporateFee.objects.get_or_create(
                        Service_Procedure_ratecard=instance,
                        corporate=corporate,
                        fee=instance.Service_ratecard.Amount,
                    )
        else:
            Service_Procedure_Rate_Charges.objects.create(
                Service_Procedure_ratecard=instance,
                General_fee=instance.Procedure_ratecard.Amount,
                Special_fee=instance.Procedure_ratecard.Amount,
            )
            for room in RoomType_Master_Detials.objects.all():
                room_type_fee, _ = Service_Procedure_RoomTypeFee.objects.get_or_create(
                    Service_Procedure_ratecard=instance,
                    room_type=room,
                    General_fee=instance.Procedure_ratecard.Amount,
                    Special_fee=instance.Procedure_ratecard.Amount,
                )
                for insurance in Insurance_Master_Detials.objects.all():
                    Service_Procedure_InsuranceRoomTypeFee.objects.get_or_create(
                        Service_Procedure_ratecard=instance,
                        room_type_fee=room,
                        insurance=insurance,
                        fee=instance.Procedure_ratecard.Amount,
                    )
                for client in Client_Master_Detials.objects.all():
                    Service_Procedure_ClientRoomTypeFee.objects.get_or_create(
                        Service_Procedure_ratecard=instance,
                        room_type_fee=room,
                        client=client,
                        fee=instance.Procedure_ratecard.Amount,
                    )
                for corporate in Corporate_Master_Detials.objects.all():
                    Service_Procedure_CorporateRoomTypeFee.objects.get_or_create(
                        Service_Procedure_ratecard=instance,
                        room_type_fee=room,
                        corporate=corporate,
                        fee=instance.Procedure_ratecard.Amount,
                    )

                    
            for insurance in Insurance_Master_Detials.objects.all():
                Service_Procedure_InsuranceFee.objects.get_or_create(
                    Service_Procedure_ratecard=instance,
                    insurance=insurance,
                    fee=instance.Procedure_ratecard.Amount,
                )
            for client in Client_Master_Detials.objects.all():
                Service_Procedure_ClientFee.objects.get_or_create(
                    Service_Procedure_ratecard=instance,
                    client=client,
                    fee=instance.Procedure_ratecard.Amount,
                )
            for corporate in Corporate_Master_Detials.objects.all():
                Service_Procedure_CorporateFee.objects.get_or_create(
                    Service_Procedure_ratecard=instance,
                    corporate=corporate,
                    fee=instance.Procedure_ratecard.Amount,
                )
       
    # ---------------- update the charge -------bharathi1

# Signal for updating related records when Service_Master_Details.Amount changes
@receiver(post_save, sender=Service_Master_Details)
def update_service_amount(sender, instance, created, **kwargs):
    if not created:  # Only trigger on updates, not on create
        
        # Find related Service_Procedure_Charges entries and update related tables
        service_procedure_charges = Service_Procedure_Charges.objects.filter(Service_ratecard=instance)
        for sp_charge in service_procedure_charges:

            # Update Service_Procedure_Rate_Charges
            for rate_charge in Service_Procedure_Rate_Charges.objects.filter(Service_Procedure_ratecard=sp_charge):
                rate_charge.General_Prev_fee = rate_charge.General_fee
                rate_charge.Special_Prev_fee = rate_charge.Special_fee
                rate_charge.General_fee = instance.Amount
                rate_charge.Special_fee = instance.Amount
                rate_charge.save()

            # Update Service_Procedure_RoomTypeFee
            for room_type_fee in Service_Procedure_RoomTypeFee.objects.filter(Service_Procedure_ratecard=sp_charge):
                room_type_fee.General_Prev_fee = room_type_fee.General_fee
                room_type_fee.Special_Prev_fee = room_type_fee.Special_fee
                room_type_fee.General_fee = instance.Amount
                room_type_fee.Special_fee = instance.Amount
                room_type_fee.save()

            # Update Service_Procedure_InsuranceFee
            for insurance_fee in Service_Procedure_InsuranceFee.objects.filter(Service_Procedure_ratecard=sp_charge):
                insurance_fee.Prev_fee = insurance_fee.fee
                insurance_fee.fee = instance.Amount
                insurance_fee.save()

            # Update Service_Procedure_ClientFee
            for client_fee in Service_Procedure_ClientFee.objects.filter(Service_Procedure_ratecard=sp_charge):
                client_fee.Prev_fee = client_fee.fee
                client_fee.fee = instance.Amount
                client_fee.save()
            
            for corporate_fee in Service_Procedure_CorporateFee.objects.filter(Service_Procedure_ratecard=sp_charge):
                corporate_fee.Prev_fee = corporate_fee.fee
                corporate_fee.fee = instance.Amount
                corporate_fee.save()
                
                
                
                

            # Update Service_Procedure_InsuranceRoomTypeFee
            for insurance_room_type_fee in Service_Procedure_InsuranceRoomTypeFee.objects.filter(Service_Procedure_ratecard=sp_charge):
                insurance_room_type_fee.Prev_fee = insurance_room_type_fee.fee
                insurance_room_type_fee.fee = instance.Amount
                insurance_room_type_fee.save()

            # Update Service_Procedure_ClientRoomTypeFee
            for client_room_type_fee in Service_Procedure_ClientRoomTypeFee.objects.filter(Service_Procedure_ratecard=sp_charge):
                client_room_type_fee.Prev_fee = client_room_type_fee.fee
                client_room_type_fee.fee = instance.Amount
                client_room_type_fee.save()
            
            for corporate_room_type_fee in Service_Procedure_CorporateRoomTypeFee.objects.filter(Service_Procedure_ratecard=sp_charge):
                corporate_room_type_fee.Prev_fee = corporate_room_type_fee.fee
                corporate_room_type_fee.fee = instance.Amount
                corporate_room_type_fee.save()
                
                
                

# Signal for updating related records when Procedure_Master_Details.Amount changes
@receiver(post_save, sender=Procedure_Master_Details)
def update_procedure_amount(sender, instance, created, **kwargs):
    if not created:  # Only trigger on updates, not on create

        # Find related Service_Procedure_Charges entries and update related tables
        procedure_procedure_charges = Service_Procedure_Charges.objects.filter(Procedure_ratecard=instance)
        for sp_charge in procedure_procedure_charges:

            # Update Service_Procedure_Rate_Charges
            for rate_charge in Service_Procedure_Rate_Charges.objects.filter(Service_Procedure_ratecard=sp_charge):
                rate_charge.General_Prev_fee = rate_charge.General_fee
                rate_charge.Special_Prev_fee = rate_charge.Special_fee
                rate_charge.General_fee = instance.Amount
                rate_charge.Special_fee = instance.Amount
                rate_charge.save()

            # Update Service_Procedure_RoomTypeFee
            for room_type_fee in Service_Procedure_RoomTypeFee.objects.filter(Service_Procedure_ratecard=sp_charge):
                room_type_fee.General_Prev_fee = room_type_fee.General_fee
                room_type_fee.Special_Prev_fee = room_type_fee.Special_fee
                room_type_fee.General_fee = instance.Amount
                room_type_fee.Special_fee = instance.Amount
                room_type_fee.save()

            # Update Service_Procedure_InsuranceFee
            for insurance_fee in Service_Procedure_InsuranceFee.objects.filter(Service_Procedure_ratecard=sp_charge):
                insurance_fee.Prev_fee = insurance_fee.fee
                insurance_fee.fee = instance.Amount
                insurance_fee.save()

            # Update Service_Procedure_ClientFee
            for client_fee in Service_Procedure_ClientFee.objects.filter(Service_Procedure_ratecard=sp_charge):
                client_fee.Prev_fee = client_fee.fee
                client_fee.fee = instance.Amount
                client_fee.save()
            # Update Service_Procedure_CorporateFee
            for corporate_fee in Service_Procedure_CorporateFee.objects.filter(Service_Procedure_ratecard=sp_charge):
                corporate_fee.Prev_fee = corporate_fee.fee
                corporate_fee.fee = instance.Amount
                corporate_fee.save()
                

            # Update Service_Procedure_InsuranceRoomTypeFee
            for insurance_room_type_fee in Service_Procedure_InsuranceRoomTypeFee.objects.filter(Service_Procedure_ratecard=sp_charge):
                insurance_room_type_fee.Prev_fee = insurance_room_type_fee.fee
                insurance_room_type_fee.fee = instance.Amount
                insurance_room_type_fee.save()

            # Update Service_Procedure_ClientRoomTypeFee
            for client_room_type_fee in Service_Procedure_ClientRoomTypeFee.objects.filter(Service_Procedure_ratecard=sp_charge):
                client_room_type_fee.Prev_fee = client_room_type_fee.fee
                client_room_type_fee.fee = instance.Amount
                client_room_type_fee.save()
            # Update Service_Procedure_CorporateRoomTypeFee
            for corporate_room_type_fee in Service_Procedure_CorporateRoomTypeFee.objects.filter(Service_Procedure_ratecard=sp_charge):
                corporate_room_type_fee.Prev_fee = corporate_room_type_fee.fee
                corporate_room_type_fee.fee = instance.Amount
                corporate_room_type_fee.save()
                
                
                
         
@receiver(post_delete, sender=Location_Detials)
def delete_related_service_procedure_charges(sender, instance, **kwargs):
    Service_Procedure_Charges.objects.filter(Location=instance).delete()

@receiver(post_delete, sender=Doctor_Personal_Form_Detials)
def delete_related_doctor_ratecards(sender, instance, **kwargs):
    Doctor_Ratecard_Master.objects.filter(Doctor_ID=instance).delete()

@receiver(post_delete, sender=RoomType_Master_Detials)
def delete_related_room_type_fees(sender, instance, **kwargs):
    RoomTypeFee.objects.filter(room_type=instance).delete()
    Service_Procedure_RoomTypeFee.objects.filter(room_type=instance).delete()

@receiver(post_delete, sender=Insurance_Master_Detials)
def delete_related_insurance_fees(sender, instance, **kwargs):
    InsuranceFee.objects.filter(insurance=instance).delete()
    InsuranceRoomTypeFee.objects.filter(insurance=instance).delete()
    Service_Procedure_InsuranceFee.objects.filter(insurance=instance).delete()
    Service_Procedure_InsuranceRoomTypeFee.objects.filter(insurance=instance).delete()

@receiver(post_delete, sender=Client_Master_Detials)
def delete_related_client_fees(sender, instance, **kwargs):
    ClientFee.objects.filter(client=instance).delete()
    ClientRoomTypeFee.objects.filter(client=instance).delete()
    Service_Procedure_ClientFee.objects.filter(client=instance).delete()
    Service_Procedure_ClientRoomTypeFee.objects.filter(client=instance).delete()

@receiver(post_delete, sender=Corporate_Master_Detials)
def delete_related_client_fees(sender, instance, **kwargs):
    CorporateFee.objects.filter(corporate=instance).delete()
    CorporateRoomTypeFee.objects.filter(corporate=instance).delete()
    Service_Procedure_CorporateFee.objects.filter(corporate=instance).delete()
    Service_Procedure_CorporateRoomTypeFee.objects.filter(corporate=instance).delete()
    
    
    
    
    

@receiver(post_delete, sender=Service_Master_Details)
def delete_related_service_procedure_charges(sender, instance, **kwargs):
    Service_Procedure_Charges.objects.filter(Service_ratecard=instance).delete()

@receiver(post_delete, sender=Procedure_Master_Details)
def delete_related_procedure_procedure_charges(sender, instance, **kwargs):
    Service_Procedure_Charges.objects.filter(Procedure_ratecard=instance).delete()





