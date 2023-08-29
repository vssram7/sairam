// import { LightningElement, wire } from 'lwc';
// import SAMPLEMC from "@salesforce/messageChannel/SampleMessageChannel__c"
// import { subscribe, MessageContext, APPLICATION_SCOPE, unsubscribe } from 'lightning/messageService';
// export default class LmsComponentX extends LightningElement {
//     recievedMessage
//     subscription
//     @wire(MessageContext)
//     context

//     connectedCallback() {
//         this.subscribeMessage()
//     }

//     subscribeMessage() {
//         //subscribe(messageContext, messageChannel, listener, subscriberOptions)
//         this.subscription = subscribe(this.context, SAMPLEMC, (message) => { this.handleMessage(message) }, { scope: APPLICATION_SCOPE })
//     }

//     handleMessage(message) {
//         this.recievedMessage = message.lmsData.value ? message.lmsData.value : 'NO Message published'
//     }

//     unsubscribeMessage() {
//         unsubscribe(this.subscription)
//         this.subscription = null
//     }

// }


import { LightningElement, api, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation'
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import createPatient from '@salesforce/apex/MyAccount.createPatient'
import AppointmentDate from '@salesforce/schema/Patients__c.Appointment_date__c'
import DoctorName from '@salesforce/schema/Patients__c.Doctor__c'
import Phone from '@salesforce/schema/Patients__c.Phone__c'
import PatientName from '@salesforce/schema/Patients__c.Name'
import Age from '@salesforce/schema/Patients__c.Age__c'
import Gender from '@salesforce/schema/Patients__c.Gender__c'
import Category from '@salesforce/schema/Patients__c.Category__c'

export default class DoctorCard extends NavigationMixin(LightningElement) {

    @track age = Age;
    @track Name = PatientName
    @track gender = Gender
    @track contactNumber = Phone
    @track category = Category
    @track appointmentDate = AppointmentDate
    @track rec = {}

    ///////////////////////////////Above all form Variables////////
    @track doctorName;
    @track diseaseType;
    showModal = false;
    buttonDisable;
    selectedCard;//card Id
    @api doctor//public property to access single doctor;
    @track changeColor;

    connectedCallback() {
        this.getStatus(this.doctor.Status__c)
        this.getButton(this.doctor.Status__c)
    }

    getStatus(Status) {
        if (Status == 'Available') {
            this.changeColor = "slds-theme_success";
        }

        else if (Status == "Busy") {
            this.changeColor = "slds-theme_offline";
        }
    }

    getButton(Status) {
        if (Status == 'Available') {
            this.buttonDisable = false;
        }
        else {
            this.buttonDisable = true;
        }
    }

    handleSelectedCard(event) {
        const individualDoctor = new CustomEvent('event', {
            detail: event.target.name
        });
        this.dispatchEvent(individualDoctor);
    }

    handleBook(event) {
        this.doctorName = event.target.name;
        this.diseaseType = event.target.value;
        this.showModal = true;
    }

    scheduleAppointment() {
        this.rec = {
            Name: this.Name,
            Age__c: this.age,
            Gender__c: this.gender,
            Phone__c: this.contactNumber,
            Appointment_date__c: this.appointmentDate,
            Doctor__c: this.selectedDoctorId
        };

        createPatient({ p: this.rec })
            .then(patientId => {
                console.log('result ' + patientId);
                this.message = JSON.parse(JSON.stringify(patientId));
                console.log("message " + this.message)
                console.log("Id" + this.message.Id)
                this.error = undefined
                if (this.message != undefined) {
                    /* this.rec.Name=''
                     this.rec.Age__c=''
                     this.rec.Gender__c=''
                     this.rec.Phone__c=''
                     this.rec.Appointment_date__c=''*/
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Appointment Successful',
                            message: " Record Id  " + this.message.Id,
                            variant: 'success'
                        })
                    )
                }
            })
            .catch(error => {
                console.log("error " + JSON.stringify(error));
                this.message = undefined;
                this.error = error
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'ERROR',
                        message: "Appointment Failure",
                        variant: 'error'
                    })
                )
            })
        this.showModal = false;
    }
    //////////////////binding values to input fields////

    handleNameChange(event) {
        this.Name = event.target.value
    }

    handleAgeChange(event) {
        this.age = event.target.value
    }

    handleGenderChange(event) {
        this.gender = event.target.value
    }

    handleDateChange(event) {
        this.appointmentDate = event.target.value
    }

    handlePhoneChange(event) {
        this.contactNumber = event.target.value
    }

    closeModal() {
        this.showModal = false;
    }
}