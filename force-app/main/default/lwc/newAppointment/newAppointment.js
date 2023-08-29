import { LightningElement, wire } from 'lwc';
import { getPicklistValuesByRecordType, getObjectInfo } from 'lightning/uiObjectInfoApi'
import APPOINTMENT_OBJECT from '@salesforce/schema/Appointment__c'
import collpatients from '@salesforce/apex/doctorsList.collpatients';
import createAppointment from '@salesforce/apex/doctorsList.createAppointment';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class NewAppointment extends LightningElement {

    patientName;
    patientId;
    doctorName;
    date;
    time;
    medicalProblem;
    status;

    statusOptions;
    patientOptions = [];
    timeOptions;
    doctorName;
    appointmentid

    @wire(collpatients)
    wiredPatientOptions({ error, data }) {
        if (data) {
            // , { label: patient.PatientId, value: patient.Name }
            this.patientOptions = data.map(patient => ({ label: patient.Patient_Name__c, value: patient.Id }));
        } else if (error) {
            console.error('Error retrieving doctor options:', error);
        }
    }


    @wire(getObjectInfo, { objectApiName: APPOINTMENT_OBJECT })
    appointmentInfo

    @wire(getPicklistValuesByRecordType, {
        objectApiName: APPOINTMENT_OBJECT,
        recordTypeId: '$appointmentInfo.data.defaultRecordTypeId'
    })
    picklistHandler({ data, error }) {
        if (data) {
            console.log(data)
            this.statusOptions = this.picklistGenerator(data.picklistFieldValues.Status__c)
            this.timeOptions = this.picklistGenerator(data.picklistFieldValues.Appointment_Time__c)
        }
        if (error) {
            console.error(error)
        }
    }

    picklistGenerator(data) {
        return data.values.map(item => ({ "label": item.label, "value": item.value }))
    }

    handlePatientNameChange(event) {
        this.patientName = event.target.value
        console.log();
    }

    handleDoctorNameChange(event) {
        this.doctorName = event.target.value
        console.log();
    }

    handleDateChange(event) {
        this.date = event.target.value
        console.log();
    }

    handleTimeChange(event) {
        this.time = event.target.value
        console.log();
    }

    handleProblemChange(event) {
        this.medicalProblem = event.target.value
        console.log();
    }

    handleStatusChange(event) {
        this.status = event.target.value
        console.log();
    }

    handleFormSubmit(event) {
        const recordId = event.target.Id;
        console.log('The recordId is:', recordId);

        createAppointment({ patientname: this.patientName, doctorId: this.doctorName, appdate: this.date, appTime: this.time, appProblem: this.medicalProblem, appStatus: this.status })
            .then(result => {
                this.appointmentid = result.Id;
                console.log('after save' + this.appointmentid);
                console.log('Appointment created successfully!');
                console.log('the doctor name is now ' + this.doctorName);
                console.log('the patientname now ' + this.patientName);
                console.log('the appointmentdate ' + this.date);
                const toastEvent = new ShowToastEvent({
                    title: 'Success!',
                    message: 'Appointment booked  successfully',
                    variant: 'success'
                });

                this.dispatchEvent(toastEvent);
                // this[NavigationMixin.Navigate]({
                //     type: 'standard__recordPage',
                //     attributes: {
                //         recordId: this.appointmentid,
                //         objectApiName: 'Appointment__c',
                //         actionName: 'view'
                //     }
                // });
            })
            .catch(error => {
                this.error = error.message;
                console.log(this.error);
            });
    }
}