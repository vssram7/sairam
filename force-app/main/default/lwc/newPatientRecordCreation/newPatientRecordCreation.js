import { LightningElement } from 'lwc';
import PATIENT_OBJECT from '@salesforce/schema/Patient__c'
import NAME_FIELD from '@salesforce/schema/Patient__c.Patient_Name__c'
import AGE_FIELD from '@salesforce/schema/Patient__c.Age__c'
import GENDER_FIELD from '@salesforce/schema/Patient__c.Gender__c';
import PHONE_FIELD from '@salesforce/schema/Patient__c.Phone_Number__c';
import EMAIL_FIELD from '@salesforce/schema/Patient__c.Email_Id__c';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class RecordEditForm extends LightningElement {
    objectName = PATIENT_OBJECT
    fields = {
        nameField: NAME_FIELD,
        ageField: AGE_FIELD,
        genderField: GENDER_FIELD,
        phoneField: PHONE_FIELD,
        emailField: EMAIL_FIELD,
    }

    handleCancel() {
        const closenewPatient = new CustomEvent('cancel')
        this.dispatchEvent(closenewPatient)
    }

    handleReset() {
        const inputFields = this.template.querySelectorAll('lightning-input-field')
        if (inputFields) {
            Array.from(inputFields).forEach(field => {
                field.reset()
            })
        }

        // this[NavigationMixin.Navigate]({
        //     type: 'standard__navItemPage',
        //     attributes: {
        //         apiName: 'Patients_List'
        //     },
        // });
        // location.reload();
    }

    successHandler(event) {
        const closePatientOnSave = new CustomEvent('save')
        this.dispatchEvent(closePatientOnSave)
        console.log(event.detail.id)
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Record has been successfully created',
                variant: 'success',
            })
        );

    }
}