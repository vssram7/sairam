import { LightningElement, api } from 'lwc';
import PATIENT_OBJECT from '@salesforce/schema/Patient__c'
import PID_FIELD from '@salesforce/schema/Patient__c.Name'
import NAME_FIELD from '@salesforce/schema/Patient__c.Patient_Name__c'
import AGE_FIELD from '@salesforce/schema/Patient__c.Age__c'
import GENDER_FIELD from '@salesforce/schema/Patient__c.Gender__c';
import PHONE_FIELD from '@salesforce/schema/Patient__c.Phone_Number__c';
import EMAIL_FIELD from '@salesforce/schema/Patient__c.Email_Id__c';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class RecordEditForm extends LightningElement {

    @api recordId;


    objectName = PATIENT_OBJECT
    fields = {
        patientId: PID_FIELD,
        nameField: NAME_FIELD,
        ageField: AGE_FIELD,
        genderField: GENDER_FIELD,
        phoneField: PHONE_FIELD,
        emailField: EMAIL_FIELD,

    }
}