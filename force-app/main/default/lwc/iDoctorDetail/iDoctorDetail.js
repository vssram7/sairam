import { LightningElement, wire, track, api } from 'lwc';
import NAME_FIELD from '@salesforce/schema/Doctor__c.Doctor_Name__c'
import PICTURE_URL_FIELD from '@salesforce/schema/Doctor__c.Profile_photo_link__c'
import SPECIALITY from '@salesforce/schema/Doctor__c.Specialization__c'
import { getFieldValue } from 'lightning/uiRecordApi'
import SAMPLEMC from "@salesforce/messageChannel/SampleMessageChannel__c"
import { subscribe, MessageContext, APPLICATION_SCOPE, unsubscribe } from 'lightning/messageService';

export default class DoctorDetailTabs extends LightningElement {

    doctorName;
    PictureUrl;
    speciality;
    @api recordId;
    @track doctorId;
    @track selectedDoctor;
    recievedMessage;
    subscription;

    @wire(MessageContext)
    context

    connectedCallback() {
        this.subscribeMessage()
    }

    subscribeMessage() {
        //subscribe(messageContext, messageChannel, listener, subscriberOptions)
        this.subscription = subscribe(this.context, SAMPLEMC, (message) => { this.handleMessage(message) }, { scope: APPLICATION_SCOPE })
    }

    handleMessage(message) {
        this.recievedMessage = message.lmsData.value ? message.lmsData.value : 'NO Message published'
        console.log("Id in detail: " + this.recievedMessage);
    }

    handleRecordLoaded(event) {
        const { records } = event.detail
        const recordData = records[this.recievedMessage]
        this.doctorName = getFieldValue(recordData, NAME_FIELD)
        this.PictureUrl = getFieldValue(recordData, PICTURE_URL_FIELD)
        this.speciality = getFieldValue(recordData, SPECIALITY)
        console.log("Hey:" + this.recordData);
    }

    // handleSelect(event) {
    //     this.doctorId = event.detail;
    //     // this.selectedDoctor = this.doctors.data.find(
    //     //     (doctor) => doctor.Id === this.doctorId
    //     // );
    //     // console.log(this.doctorId);
    //     // console.log(JSON.stringify(this.selectedDoctor));
    // }
}