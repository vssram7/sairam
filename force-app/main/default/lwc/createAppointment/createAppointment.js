import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import APPOINTMENT_OBJECT from '@salesforce/schema/Appointment__c'
import ADATE_FIELD from '@salesforce/schema/Appointment__c.Appointment_Date__c'
import ATIME_FIELD from '@salesforce/schema/Appointment__c.Appointment_Time__c'
import DOCTOR_FIELD from '@salesforce/schema/Appointment__c.Doctor__c'
import MEDICAL_PROBLEM_FIELD from '@salesforce/schema/Appointment__c.Medical_Problem__c';
import PATIENT_FIELD from '@salesforce/schema/Appointment__c.Patient__c';
import STATUS_FIELD from '@salesforce/schema/Appointment__c.Status__c';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class CreateAppointment extends NavigationMixin(LightningElement) {

    @api patientId;

    objectName = APPOINTMENT_OBJECT
    fields = {
        aDateField: ADATE_FIELD,
        aTimeField: ATIME_FIELD,
        doctorField: DOCTOR_FIELD,
        patientField: PATIENT_FIELD,
        statusField: STATUS_FIELD,
        medicalField: MEDICAL_PROBLEM_FIELD
    }

    handleCancel() {
        this[NavigationMixin.Navigate]({
            type: 'standard__navItemPage',
            attributes: {
                apiName: 'Patients_List'
            },
        });

    }

    successHandler(event) {
        console.log(event.detail.id)
        const toastEvent = new ShowToastEvent({
            title: "Appointment created",
            message: "Appointment successfully scheduled",
            variant: "success"
        })
        this.dispatchEvent(toastEvent)

        this[NavigationMixin.Navigate]({
            type: 'standard__navItemPage',
            attributes: {
                apiName: 'Patients_List'
            },
        });
        location.reload();
    }
}