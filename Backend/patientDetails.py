from flask import Flask, jsonify;
import pandas as pd;
from icd9formatter import getICD9codes;

admissionsDF = pd.read_csv(r'assets\admissions.csv');
patientsDF =  pd.read_csv(r'assets\patient.csv');

def setPatientDetails(hadmID):

    patientAdmission = admissionsDF[admissionsDF.HADM_ID == int(hadmID)]
    i =patientAdmission.index[0]
    subID = patientAdmission.SUBJECT_ID[i]
    
    patientDetails = patientsDF[patientsDF.SUBJECT_ID==subID]
    j = patientDetails.index[0]
    
    patientData = {
            'subjectID':str(subID),
            'hadmID':hadmID,
            'diagnosis': patientAdmission.DIAGNOSIS[i],
            'insurance': patientAdmission.INSURANCE[i],
            'admissionTime':patientAdmission.ADMITTIME[i],
            'admissionType':patientAdmission.ADMISSION_TYPE[i],
            'admissionLocation':patientAdmission.ADMISSION_LOCATION[i],
            'gender': patientsDF.GENDER[j],
            'dob': patientsDF.DOB[j]
        }
    
    return patientData