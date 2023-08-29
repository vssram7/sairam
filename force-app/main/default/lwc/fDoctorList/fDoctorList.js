import { LightningElement, api, track, wire } from 'lwc';
import collDoctors from '@salesforce/apex/doctorsList.collDoctors';
import { getPicklistValuesByRecordType, getObjectInfo } from 'lightning/uiObjectInfoApi'
import APPOINTMENT_OBJECT from '@salesforce/schema/Appointment__c'
import collpatients from '@salesforce/apex/doctorsList.collpatients';
import createAppointment from '@salesforce/apex/doctorsList.createAppointment';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class FDoctorDetails extends LightningElement {


    @api getDoctor;
    error;
    selectedDoctor = null;
    @track searchKey = '';
    showNewAppointment = false;
    patientName;
    patientId;
    doctorName;
    doctorId;
    date;
    time;
    medicalProblem;
    status;

    statusOptions;
    patientOptions = [];
    timeOptions;
    appointmentid;

    handleDoctor(event) {
        const selectedDoctorId = event.detail
        this.selectedDoctor = this.getDoctor.find((item) => item.Id === selectedDoctorId)
        this.doctorName = this.selectedDoctor.Doctor_Name__c;
        this.doctorId = this.selectedDoctor.Id;
        console.log("selectedDoctor: " + JSON.stringify(this.selectedDoctor));
        console.log("is it:" + this.selectedDoctor.Avalable__c);
        if (this.selectedDoctor.Avalable__c == true) {
            this.doctorAvailable = true;
        }
        else {
            this.doctorAvailable = false;
        }
    }

    handleKeyChange(event) {
        this.searchKey = event.target.value;
    }

    @wire(collDoctors, { searchKey: '$searchKey' })
    getDoctorsList({ data, error }) {
        if (data) {
            let sData = JSON.parse(JSON.stringify(data));
            this.getDoctor = sData;
            this.error = undefined;
        }
        else if (error) {
            this.error = error;
            this.data = undefined;
        }
    }

    handleBookAppointmentClick() {
        this.showNewAppointment = true;
    }
    handleDialogClose() {
        this.showNewAppointment = false;
    }
    handleCloseAppointment() {
        this.showNewAppointment = false;
    }


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
    }


    // handleDoctorNameChange(event) {
    //     this.doctorName = event.target.value
    // }

    handleDateChange(event) {
        this.date = event.target.value
    }

    handleTimeChange(event) {
        this.time = event.target.value
    }

    handleProblemChange(event) {
        this.medicalProblem = event.target.value
    }

    handleStatusChange(event) {
        this.status = event.target.value
    }

    handleFormSubmit(event) {
        const recordId = event.target.Id;
        console.log('The recordId is:', recordId);

        createAppointment({ patientname: this.patientName, doctorId: this.doctorId, appdate: this.date, appTime: this.time, appProblem: this.medicalProblem, appStatus: this.status })
            .then(result => {
                this.appointmentid = result.Id;
                const toastEvent = new ShowToastEvent({
                    title: 'Success!',
                    message: 'Appointment booked  successfully',
                    variant: 'success'
                });
                this.dispatchEvent(toastEvent);
            })
            .catch(error => {
                this.error = error.message;
                console.log(this.error);
            });
        this.showNewAppointment = false;
    }

}