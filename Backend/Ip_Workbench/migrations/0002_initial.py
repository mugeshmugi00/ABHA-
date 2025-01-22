# Generated by Django 5.1.4 on 2025-01-20 12:00

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('Frontoffice', '0002_initial'),
        ('Inventory', '0002_initial'),
        ('Ip_Workbench', '0001_initial'),
        ('Masters', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='ip_billing_entry',
            name='Physician',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.CASCADE, to='Masters.doctor_professform_detials'),
        ),
        migrations.AddField(
            model_name='ip_billing_entry',
            name='Procedure',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.CASCADE, to='Masters.procedure_master_details'),
        ),
        migrations.AddField(
            model_name='ip_billing_entry',
            name='Registration_Id',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='IP_Billing_details_Registration_Id', to='Frontoffice.patient_ip_registration_detials'),
        ),
        migrations.AddField(
            model_name='ip_billing_entry',
            name='Service',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='IP_Billing_details_Service', to='Masters.service_master_details'),
        ),
        migrations.AddField(
            model_name='ip_bloodlines_details',
            name='Casuality_Registration_Id',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='IP_BloodLines_Casuality_Registration_Id', to='Frontoffice.patient_casuality_registration_detials'),
        ),
        migrations.AddField(
            model_name='ip_bloodlines_details',
            name='Ip_Registration_Id',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='IP_BloodLines_Ip_Registration_Id', to='Frontoffice.patient_ip_registration_detials'),
        ),
        migrations.AddField(
            model_name='ip_bloodtransfusedrecord_details',
            name='Casuality_Registration_Id',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='IP_BlTrans_Casuality_Registration_Id', to='Frontoffice.patient_casuality_registration_detials'),
        ),
        migrations.AddField(
            model_name='ip_bloodtransfusedrecord_details',
            name='Ip_Registration_Id',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='IP_BlTrans_Ip_Registration_Id', to='Frontoffice.patient_ip_registration_detials'),
        ),
        migrations.AddField(
            model_name='ip_consernforms_details',
            name='Casuality_Registration_Id',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='IP_Consern_Casuality_Registration_Id', to='Frontoffice.patient_casuality_registration_detials'),
        ),
        migrations.AddField(
            model_name='ip_consernforms_details',
            name='Ip_Registration_Id',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='IP_Consern_Ip_Registration_Id', to='Frontoffice.patient_ip_registration_detials'),
        ),
        migrations.AddField(
            model_name='ip_consultation',
            name='Physician',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.CASCADE, to='Masters.doctor_professform_detials'),
        ),
        migrations.AddField(
            model_name='ip_consultation',
            name='Registration_Id',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='IP_Consultation_details_Registration_Id', to='Frontoffice.patient_ip_registration_detials'),
        ),
        migrations.AddField(
            model_name='ip_dama_details',
            name='Casuality_Registration_Id',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='IP_Dama_Casuality_Registration_Id', to='Frontoffice.patient_casuality_registration_detials'),
        ),
        migrations.AddField(
            model_name='ip_dama_details',
            name='Ip_Registration_Id',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='IP_Dama_Ip_Registration_Id', to='Frontoffice.patient_ip_registration_detials'),
        ),
        migrations.AddField(
            model_name='ip_discharge_checklist',
            name='Registration_Id',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='DischargeChecklist_details_Registration_Id', to='Frontoffice.patient_ip_registration_detials'),
        ),
        migrations.AddField(
            model_name='ip_discharge_clearance',
            name='Registration_Id',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='Discharge_Clearance_details_Registration_Id', to='Frontoffice.patient_ip_registration_detials'),
        ),
        migrations.AddField(
            model_name='ip_dischargecancel_details',
            name='Doctor_Id',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.CASCADE, to='Masters.doctor_professform_detials'),
        ),
        migrations.AddField(
            model_name='ip_dischargecancel_details',
            name='Registration_Id',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.CASCADE, to='Frontoffice.patient_ip_registration_detials'),
        ),
        migrations.AddField(
            model_name='ip_dischargerequest_details',
            name='Doctor_Id',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.CASCADE, to='Masters.doctor_professform_detials'),
        ),
        migrations.AddField(
            model_name='ip_dischargerequest_details',
            name='Registration_Id',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.CASCADE, to='Frontoffice.patient_ip_registration_detials'),
        ),
        migrations.AddField(
            model_name='ip_dischargesummary',
            name='Casuality_Registration_Id',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='IP_Discharge_Casuality_Registration_Id', to='Frontoffice.patient_casuality_registration_detials'),
        ),
        migrations.AddField(
            model_name='ip_dischargesummary',
            name='Ip_Registration_Id',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='IP_Discharge_Ip_Registration_Id', to='Frontoffice.patient_ip_registration_detials'),
        ),
        migrations.AddField(
            model_name='ip_drainagetubes_details',
            name='Casuality_Registration_Id',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='IP_Drainage_Casuality_Registration_Id', to='Frontoffice.patient_casuality_registration_detials'),
        ),
        migrations.AddField(
            model_name='ip_drainagetubes_details',
            name='Ip_Registration_Id',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='IP_Drainage_Ip_Registration_Id', to='Frontoffice.patient_ip_registration_detials'),
        ),
        migrations.AddField(
            model_name='ip_inchargeandrefer_details',
            name='Casuality_Registration_Id',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='InchargeAndRefer_details_Casuality_Registration_Id', to='Frontoffice.patient_casuality_registration_detials'),
        ),
        migrations.AddField(
            model_name='ip_inchargeandrefer_details',
            name='Doctor_Id',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='InchargeAndRefer_details_Doctor_Id', to='Masters.doctor_professform_detials'),
        ),
        migrations.AddField(
            model_name='ip_inchargeandrefer_details',
            name='Ip_Registration_Id',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='InchargeAndRefer_details_Registration_Id', to='Frontoffice.patient_ip_registration_detials'),
        ),
        migrations.AddField(
            model_name='ip_intake_details',
            name='Casuality_Registration_Id',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='Casuality_Registration_Id_intake', to='Frontoffice.patient_casuality_registration_detials'),
        ),
        migrations.AddField(
            model_name='ip_intake_details',
            name='Ip_Registration_Id',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='Ip_Registration_Id_intake', to='Frontoffice.patient_ip_registration_detials'),
        ),
        migrations.AddField(
            model_name='ip_mlc_details',
            name='Casuality_Registration_Id',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='IP_Mlc_Casuality_Registration_Id', to='Frontoffice.patient_casuality_registration_detials'),
        ),
        migrations.AddField(
            model_name='ip_mlc_details',
            name='Ip_Registration_Id',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='IP_Mlc_Ip_Registration_Id', to='Frontoffice.patient_ip_registration_detials'),
        ),
        migrations.AddField(
            model_name='ip_output_details',
            name='Casuality_Registration_Id',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='Casuality_Registration_Id_Output', to='Frontoffice.patient_casuality_registration_detials'),
        ),
        migrations.AddField(
            model_name='ip_output_details',
            name='Ip_Registration_Id',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='Ip_Registration_Id_Output', to='Frontoffice.patient_ip_registration_detials'),
        ),
        migrations.AddField(
            model_name='ip_patientcare_details',
            name='Registration_Id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='PatientCare_details', to='Frontoffice.patient_ip_registration_detials'),
        ),
        migrations.AddField(
            model_name='ip_physical_discharge',
            name='Registration_Id',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='Physical_Discharge_details_Registration_Id', to='Frontoffice.patient_ip_registration_detials'),
        ),
        migrations.AddField(
            model_name='ip_preopchecklist_details',
            name='Casuality_Registration_Id',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='IP_Preop_Casuality_Registration_Id', to='Frontoffice.patient_casuality_registration_detials'),
        ),
        migrations.AddField(
            model_name='ip_preopchecklist_details',
            name='Ip_Registration_Id',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='IP_Preop_Ip_Registration_Id', to='Frontoffice.patient_ip_registration_detials'),
        ),
        migrations.AddField(
            model_name='ip_preopinstructions_details',
            name='Casuality_Registration_Id',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='IP_PreOpIns_Casuality_Registration_Id', to='Frontoffice.patient_casuality_registration_detials'),
        ),
        migrations.AddField(
            model_name='ip_preopinstructions_details',
            name='Ip_Registration_Id',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='IP_PreOpIns_Ip_Registration_Id', to='Frontoffice.patient_ip_registration_detials'),
        ),
        migrations.AddField(
            model_name='ip_progressnotes_details',
            name='Casuality_Registration_Id',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='IP_ProgressNotes_Casuality_Registration_Id', to='Frontoffice.patient_casuality_registration_detials'),
        ),
        migrations.AddField(
            model_name='ip_progressnotes_details',
            name='Ip_Registration_Id',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='IP_ProgressNotes_Ip_Registration_Id', to='Frontoffice.patient_ip_registration_detials'),
        ),
        migrations.AddField(
            model_name='ip_surgicalhistory_details',
            name='Casuality_Registration_Id',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='IP_SurgicalHistory_Casuality_Registration_Id', to='Frontoffice.patient_casuality_registration_detials'),
        ),
        migrations.AddField(
            model_name='ip_surgicalhistory_details',
            name='Ip_Registration_Id',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='IP_SurgicalHistory_Ip_Registration_Id', to='Frontoffice.patient_ip_registration_detials'),
        ),
        migrations.AddField(
            model_name='ip_surgicalsite_details',
            name='Registration_Id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='SurgicalSite_details', to='Frontoffice.patient_ip_registration_detials'),
        ),
        migrations.AddField(
            model_name='ip_therapy_order_details',
            name='DoctorName',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='doctor_therapy_orders', to='Masters.doctor_personal_form_detials'),
        ),
        migrations.AddField(
            model_name='ip_therapy_order_details',
            name='Location',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Masters.location_detials'),
        ),
        migrations.AddField(
            model_name='ip_therapy_order_details',
            name='Patient_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Frontoffice.patient_detials'),
        ),
        migrations.AddField(
            model_name='ip_therapy_order_details',
            name='Speciality_Name',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Masters.speciality_detials'),
        ),
        migrations.AddField(
            model_name='ip_therapy_order_details',
            name='Therapy_Name',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Masters.therapytype_detials'),
        ),
        migrations.AddField(
            model_name='ip_therapy_order_details',
            name='Visit_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Frontoffice.patient_visit_detials'),
        ),
        migrations.AddField(
            model_name='ip_urinarycathetor_details',
            name='Casuality_Registration_Id',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='IP_Urinary_Casuality_Registration_Id', to='Frontoffice.patient_casuality_registration_detials'),
        ),
        migrations.AddField(
            model_name='ip_urinarycathetor_details',
            name='Ip_Registration_Id',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='IP_Urinary_Ip_Registration_Id', to='Frontoffice.patient_ip_registration_detials'),
        ),
        migrations.AddField(
            model_name='ip_ventilatorsettings_details',
            name='Casuality_Registration_Id',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='IP_Ventilator_Casuality_Registration_Id', to='Frontoffice.patient_casuality_registration_detials'),
        ),
        migrations.AddField(
            model_name='ip_ventilatorsettings_details',
            name='Ip_Registration_Id',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='IP_Ventilator_Ip_Registration_Id', to='Frontoffice.patient_ip_registration_detials'),
        ),
        migrations.AddField(
            model_name='ip_vital_details',
            name='Casuality_Registration_Id',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='Casuality_Vitals_Registration_Id', to='Frontoffice.patient_casuality_registration_detials'),
        ),
        migrations.AddField(
            model_name='ip_vital_details',
            name='Ip_Registration_Id',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='IP_Vitals_Registration_Id', to='Frontoffice.patient_ip_registration_detials'),
        ),
        migrations.AddField(
            model_name='ipd_handover_details',
            name='Registration_Id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='IP_Admission_Registration_Id', to='Frontoffice.patient_ip_registration_detials'),
        ),
        migrations.AddField(
            model_name='medications_for_therapy',
            name='Generic_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Masters.genericname_master_details'),
        ),
        migrations.AddField(
            model_name='medications_for_therapy',
            name='Item_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Inventory.product_master_all_category_details'),
        ),
        migrations.AddField(
            model_name='medications_for_therapy',
            name='Location',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Masters.location_detials'),
        ),
        migrations.AddField(
            model_name='medications_for_therapy',
            name='Patientid',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Frontoffice.patient_detials'),
        ),
        migrations.AddField(
            model_name='medications_for_therapy',
            name='Registration_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Frontoffice.patient_appointment_registration_detials'),
        ),
        migrations.AddField(
            model_name='medications_for_therapy',
            name='Visit_Id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Frontoffice.patient_visit_detials'),
        ),
        migrations.AddField(
            model_name='ot_request_details',
            name='DoctorName',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='ot_doctor_name', to='Masters.doctor_personal_form_detials'),
        ),
        migrations.AddField(
            model_name='ot_request_details',
            name='Specialization',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='ot_surgery_speciality', to='Masters.speciality_detials'),
        ),
        migrations.AddField(
            model_name='ot_request_details',
            name='SurgeryName',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='ot_surgery_name', to='Masters.surgeryname_details'),
        ),
        migrations.AddField(
            model_name='ot_request_details',
            name='TheatreName',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='ot_theatre_name', to='Masters.ottheatermaster_detials'),
        ),
        migrations.AddField(
            model_name='therapist_complete_data',
            name='Location',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Masters.location_detials'),
        ),
        migrations.AddField(
            model_name='therapist_complete_data',
            name='PatientId',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Frontoffice.patient_detials'),
        ),
        migrations.AddField(
            model_name='therapist_complete_data',
            name='TherapyOrderId',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Ip_Workbench.ip_therapy_order_details'),
        ),
        migrations.AddField(
            model_name='therapist_complete_data',
            name='VisitId',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Frontoffice.patient_visit_detials'),
        ),
    ]
