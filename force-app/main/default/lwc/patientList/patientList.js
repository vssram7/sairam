import { LightningElement, track, wire, api } from 'lwc';
import collpatients from '@salesforce/apex/doctorsList.collpatients';
import getDoctorList from '@salesforce/apex/doctorsList.getDoctorList';
import { deleteRecord } from 'lightning/uiRecordApi';
import { getPicklistValuesByRecordType, getObjectInfo } from 'lightning/uiObjectInfoApi'
import APPOINTMENT_OBJECT from '@salesforce/schema/Appointment__c'
import createAppointment from '@salesforce/apex/doctorsList.createAppointment';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import PATIENT_OBJECT from '@salesforce/schema/Patient__c'
import NAME_FIELD from '@salesforce/schema/Patient__c.Patient_Name__c'
import AGE_FIELD from '@salesforce/schema/Patient__c.Age__c'
import GENDER_FIELD from '@salesforce/schema/Patient__c.Gender__c';
import PHONE_FIELD from '@salesforce/schema/Patient__c.Phone_Number__c';
import EMAIL_FIELD from '@salesforce/schema/Patient__c.Email_Id__c';

export default class PatientList extends LightningElement {
    recordId;
    patientId;
    rowData;
    @track patientData;
    showDeleteConfirmation = false;

    patientName;
    doctorName;
    date;
    time;
    medicalProblem;
    status;

    statusOptions;
    doctorOptions;
    timeOptions;
    doctorName;
    appointmentid

    @wire(collpatients)
    finalPatients({ error, data }) {

        if (data) {
            this.patientData = data;
            this.error = undefined;
        }
        else if (error) {
            this.error = error;
            this.patientData = undefined;
        }
    }

    patientColumns = [
        { label: "Patient ID", type: "text", fieldName: "Name" },
        { label: "Patient Name", type: 'text', fieldName: 'Patient_Name__c' },
        { label: "Age", fieldName: 'Age__c' },
        { label: "Gender", fieldName: 'Gender__c' },
        { label: "Phone Number", fieldName: 'Phone_Number__c' },
        {
            type: 'button', label: 'Detail',
            typeAttributes: { label: 'Patient details', name: 'view', variant: 'Brand' }
        },
        {
            type: 'button', label: 'New Appointment',
            typeAttributes: { label: 'Re-Book Appointment', name: 'book', variant: 'success' }
        },
        {
            type: 'button', label: 'Delete Patient',
            typeAttributes: { label: 'Delete', name: 'delete', variant: 'destructive' }
        }

    ];

    showNewPatient = false;
    showPatientDetail = false;
    showNewAppointment = false;

    objectName = PATIENT_OBJECT
    fields = {
        nameField: NAME_FIELD,
        ageField: AGE_FIELD,
        genderField: GENDER_FIELD,
        phoneField: PHONE_FIELD,
        emailField: EMAIL_FIELD,
    }

    handleNewrecordCancel() {
        this.showNewPatient = false;
    }

    handleReset() {
        const inputFields = this.template.querySelectorAll('lightning-input-field')
        if (inputFields) {
            Array.from(inputFields).forEach(field => {
                field.reset()
            })
        }
    }

    successHandler(event) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Record has been successfully created',
                variant: 'success',
            })
        );
        this.showNewPatient = false;
    }

    handleNewPatient() {
        this.showNewPatient = true;
    }
    handleCloseAppointment() {
        this.showNewAppointment = false;
    }
    handleDialogClose() {
        this.showNewPatient = false;
        this.showPatientDetail = false;
        this.showNewAppointment = false;
        this.showDeleteConfirmation = false;
    }


    handleRowButtonClick(event) {
        const row = event.detail.row;
        const rowData = JSON.parse(JSON.stringify(row));
        this.rowData = rowData;
        this.recordId = this.rowData.Id;
        this.patientName = this.rowData.Patient_Name__c;
        if (event.detail.action.name == 'view') {
            this.showPatientDetail = true;
            this.recordId = this.rowData.Id;
            console.log(this.rowData.Id);
        }
        else if (event.detail.action.name == 'book') {
            this.showNewAppointment = true;
            this.patientId = this.rowData.Id;
        }
        else if (event.detail.action.name == 'delete') {
            this.showDeleteConfirmation = true;
        }
    }

    handleCancelClick() {
        this.showDeleteConfirmation = false;
    }

    handleDeleteClick() {
        deleteRecord(this.recordId)
        this.showDeleteConfirmation = false;
        location.reload();
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Record has been successfully deleted',
                variant: 'success',
            })
        );
    }

    handleCancel() {
        this.showNewAppointment = false;
    }

    // handleSave() {
    //     this.showNewAppointment = false;
    // }

    @wire(getDoctorList)
    wiredDoctorOptions({ error, data }) {
        if (data) {
            console.log("is this:" + data)
            this.doctorOptions = data.map(doctor => ({ label: doctor.Doctor_Name__c, value: doctor.Id }));
            console.log("is this doctorOptions:" + this.doctorOptions)
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

    handleDoctorNameChange(event) {
        this.doctorName = event.target.value
    }

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
        createAppointment({ patientname: this.recordId, doctorId: this.doctorName, appdate: this.date, appTime: this.time, appProblem: this.medicalProblem, appStatus: this.status })
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