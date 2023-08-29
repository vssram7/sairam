public class doctorsList {
  @AuraEnabled(cacheable=true)
public static List<Doctor__c> collDoctors(String searchKey){
  String key = '%' + searchKey + '%';
  return [SELECT id, Name, Consultation_Fee__c, Doctor_Name__c, Rating__c,Avalable__c, Doctor_Rating__c, Experience__c, Profile_photo_link__c, Specialization__c
          FROM Doctor__c  WHERE Doctor_Name__c   LIKE :key OR  Specialization__c LIKE :key];
}

@AuraEnabled(cacheable=true)
public static List<Patient__c> collpatients(){
  return [SELECT id, Name, Age__c, Patient_Name__c, Phone_Number__c, Gender__c
          FROM Patient__c order by Name desc];
}

@AuraEnabled(cacheable=true)
public static List<Doctor__c> getDoctorList(){
  // String key = '%' + searchKey + '%';
  return [SELECT id, Name, Consultation_Fee__c, Doctor_Name__c, Rating__c,Avalable__c, Doctor_Rating__c, Experience__c, Profile_photo_link__c, Specialization__c,
(SELECT id, Name, 	Appointment_Date__c, Appointment_Time__c, Medical_Problem__c, Status__c, Doctor__r.Doctor_Name__c, Patient_Name__c, Patient_Id__c, Doctor_Id__c, Doctor_Name__c
FROM Appointments__r)
          FROM Doctor__c];
}

@AuraEnabled(cacheable=true)
public static List<Appointment__c> getAppointmentsList(){
  return [SELECT id, Name, 	Appointment_Date__c, Patient_Name__c,Doctor_Id__c,Doctor_Name__c, Patient_Id__c, Appointment_Time__c, Medical_Problem__c, Status__c, Doctor__r.Doctor_Name__c,Patient__c
          FROM Appointment__c];
}

  @AuraEnabled
      public static Appointment__c createAppointment( String patientname, String doctorId, Date appdate, String appTime, String appProblem, string appStatus) {
          try {        
              Appointment__c  appt = new Appointment__c();
              appt.Patient__c = patientname;
              appt.Doctor__c = doctorId;
              appt.Appointment_Date__c = appdate;
              appt.Appointment_Time__c = appTime;
              appt.Medical_Problem__c = appProblem;
              appt.Status__c = appStatus;
              //appt.AppointmentTime__c = apptime;
            insert appt;
            return appt;
              //Date appdate, Time apptime

        } catch(Exception ex) {
            // Handle any errors that might occur during the account creation process
            System.debug('Error creating account: ' + ex.getMessage());
            throw new AuraHandledException('Error creating account: ' + ex.getMessage());
        }
    }
}