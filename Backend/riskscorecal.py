from datetime import datetime
from flask import Flask, jsonify;
import pandas as pd;
from icd9formatter import getICD9codes;

def getPatientSample():
    diagnosesDF = pd.read_csv(r'assets\diagnoses_icd.csv');
    admissionsDF = pd.read_csv(r'assets\admissions.csv');
    patientsDF =  pd.read_csv(r'assets\patient.csv');

    #Filtering out expired patients
    patientExpireFilter = patientsDF.EXPIRE_FLAG == 0
    patientsDF = patientsDF[patientExpireFilter];

    #filtering out newborn
    admissionsNewbornfilter = admissionsDF.ADMISSION_TYPE != "NEWBORN"
    admissionsDF = admissionsDF[admissionsNewbornfilter]

    #Creating a sample with 5000 patients
    patientsSample = patientsDF.query("SUBJECT_ID in @admissionsDF.SUBJECT_ID").sample(5000)

    patientsSample['EDscore'] = 0
    patientsSample['CCscore'] = 0
    patientsSample['Riskscore'] = 0
    patientsSample['HADM_ID'] = 0
    patientsSample['ADMITTIME']= 0
    patientsSample['AGE']= 0
    patientsSample['Riskgroup']= 0

    for i in patientsSample.index:
        x = admissionsDF[admissionsDF.SUBJECT_ID == patientsSample['SUBJECT_ID'][i]].sort_values(by=['ADMITTIME'],ascending=[False])
        latestHADMID = x['HADM_ID'].iloc[0]
        patientsSample.loc[i,'HADM_ID'] = latestHADMID
        patientsSample.loc[i,'ADMITTIME']= x['ADMITTIME'].iloc[0]
        k = 0
        for j in x.ADMITTIME:
            curr = datetime.strptime(j, '%Y-%m-%d %H:%M:%S')
            latest = datetime.strptime(patientsSample['ADMITTIME'][i], '%Y-%m-%d %H:%M:%S')
            duration = latest - curr
            duration_in_s = duration.total_seconds()
            if divmod(duration_in_s, 31536000)[0]<3 and x['ADMISSION_TYPE'].iloc[k] == "EMERGENCY":
                patientsSample.loc[i,'EDscore']+=1
            k+=1

    for i in patientsSample.index:
        curr = datetime.strptime(patientsSample['DOB'][i], '%Y-%m-%d %H:%M:%S')
        latest = datetime.strptime(patientsSample['ADMITTIME'][i], '%Y-%m-%d %H:%M:%S')
        duration = latest - curr
        duration_in_s = duration.total_seconds()
        age = divmod(duration_in_s, 31536000)[0]
        if age > 90:
            age = 90
        patientsSample.loc[i,'AGE']= age

        x = int(patientsSample['EDscore'][i]) - 1
        if x >=3:
            x = 4
        elif x > 1:
            x = 3
        elif x == 1:
            x = 2
        else:
            x = 1
        patientsSample.loc[i,'EDscore'] = x

    CCicd9codes = getICD9codes()
    new_df = diagnosesDF[(diagnosesDF.ICD9_CODE.isin(map(str,CCicd9codes)))]
    temp = new_df.HADM_ID.value_counts()

    for i in patientsSample.index:
        if patientsSample['HADM_ID'][i] in temp:
            x = temp[patientsSample['HADM_ID'][i]]
        else:
            x = 0
        if x >=3:
            x = 4
        elif x > 1:
            x = 3
        elif x == 1:
            x = 2
        else:
            x = 1
        patientsSample.loc[i,'CCscore'] = x
        x = (x*0.5)+ (patientsSample['EDscore'][i]*0.5)
        patientsSample.loc[i,'Riskscore'] = x
        if x > 3:
            patientsSample.loc[i,'Riskgroup'] ="Urgent"
        elif x >2:
            patientsSample.loc[i,'Riskgroup'] ="High"
        elif x >1:
            patientsSample.loc[i,'Riskgroup'] ="Medium"
        else:
            patientsSample.loc[i,'Riskgroup'] ="Low"

    print(patientsSample.sort_values(by=['Riskscore'],ascending=[False]))

    return patientsSample

getPatientSample()
