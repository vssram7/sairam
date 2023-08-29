import { LightningElement, wire } from 'lwc';
import getAppointmentsList from '@salesforce/apex/doctorsList.getAppointmentsList';
import getDoctorList from '@salesforce/apex/doctorsList.getDoctorList';
const today = new Date();
const year = today.getFullYear();
const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
const day = today.getDate().toString().padStart(2, '0');

export default class Doctorpatients extends LightningElement {

    isTabsVisible = false;
    error;
    appointmentsdata;
    appointmentNewData;
    apointmentOldData;
    appointmentRelatedOldData;
    formattedDate = `${year}-${month}-${day}`;
    doctorId;
    loggedDoctor;
    childAppointments = [];
    loggedDoctorNewAppointments = [];
    loggedDoctorOldAppointments = [];
    loggedDoctorUpAppointments = [];
    appointmentId;
    showPatientHistory = false;
    appointmentRecord;
    relatedAppointmentsList = [];
    isExitVisible = false;
    apointmentUpData;

    appointmentColumns = [
        { label: "Patient Id", fieldName: "Patient_Id__c" },
        { label: "Patient Name", fieldName: 'Patient_Name__c' },
        { label: "Medical Problem", fieldName: 'Medical_Problem__c' },
        { label: "Appointment date", fieldName: 'Appointment_Date__c' },
        { label: 'Appointment Time', fieldName: 'Appointment_Time__c' },
        { label: 'Status', fieldName: 'Status__c', editable: true },
        {
            type: 'button', label: 'Patient History',
            typeAttributes: { label: 'Patient History', name: 'History', variant: 'Brand' }
        }
    ];

    RelatedappointmentColumns = [
        { label: "Patient Id", fieldName: "Patient_Id__c" },
        { label: "Patient Name", fieldName: 'Patient_Name__c' },
        { label: "Medical Problem", fieldName: 'Medical_Problem__c' },
        { label: 'Doctor Name', fieldName: 'Doctor_Name__c' },
        { label: "Appointment date", fieldName: 'Appointment_Date__c' },
        { label: 'Appointment Time', fieldName: 'Appointment_Time__c' },

        { label: 'Status', fieldName: 'Status__c', editable: true }
    ];

    @wire(getDoctorList)
    getDoctorsList({ data, error }) {
        if (data) {
            let dData = JSON.parse(JSON.stringify(data));
            this.getDoctor = dData;
            this.error = undefined;
        }
        else if (error) {
            this.error = error;
            this.data = undefined;
        }
    }

    @wire(getAppointmentsList)
    getAppointmentsList({ data, error }) {
        if (data) {
            let aData = JSON.parse(JSON.stringify(data));
            this.appointmentsdata = aData;
            this.error = undefined;
            console.log("appointmentsdata: " + this.appointmentsdata);
        }
        else if (error) {
            this.error = error;
            this.data = undefined;
        }
    }

    handleIdChange(event) {
        this.doctorId = event.target.value;
    }

    handleEnterClick() {
        this.loggedDoctor = this.getDoctor.find((item) => item.Name == this.doctorId)
        this.childAppointments = this.loggedDoctor['Appointments__r'];
        if (this.childAppointments) {
            for (var i = 0; i < this.childAppointments.length; i++) {
                if (this.childAppointments[i].Appointment_Date__c == this.formattedDate) {
                    this.loggedDoctorNewAppointments.push(this.childAppointments[i]);
                }
                else if (this.childAppointments[i].Appointment_Date__c < this.formattedDate) {
                    this.loggedDoctorOldAppointments.push(this.childAppointments[i]);
                }
                else {
                    this.loggedDoctorUpAppointments.push(this.childAppointments[i]);
                }

            }
        }
        this.isTabsVisible = true;
        this.isExitVisible = true;
        this.appointmentNewData = this.loggedDoctorNewAppointments;
        this.apointmentOldData = this.loggedDoctorOldAppointments;
        this.apointmentUpData = this.loggedDoctorUpAppointments;
    }

    handlePatientHistoryClick(event) {
        this.showPatientHistory = true;
        const row = event.detail.row
        const rowData = JSON.parse(JSON.stringify(row));
        this.appointmentId = rowData.Id
        this.appointmentRecord = this.appointmentsdata.find((item) => item.Id === this.appointmentId)
        for (let i = 0; i < this.appointmentsdata.length; i++) {
            if (this.appointmentRecord.Patient__c === this.appointmentsdata[i].Patient__c) {
                this.relatedAppointmentsList.push(this.appointmentsdata[i]);
            }
        }
        this.appointmentRelatedOldData = [...this.relatedAppointmentsList];
        this.relatedAppointmentsList.splice(0);
    }

    handleDialogClose() {
        this.showPatientHistory = false;
    }

    handleExitClick() {
        this.loggedDoctor = "";
        this.isTabsVisible = false;
        this.isExitVisible = false;
    }
}