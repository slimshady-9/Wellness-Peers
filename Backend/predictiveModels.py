
from sklearn.model_selection import train_test_split
import pandas as pd
from sklearn.metrics import r2_score, mean_squared_error
from sklearn.ensemble import GradientBoostingRegressor
from datetime import datetime

from icd9formatter import getICD9codes;


diagnosesDF = pd.read_csv(r'assets\diagnoses_icd.csv');
admissionsDF = pd.read_csv(r'assets\admissions.csv');
patientsDF =  pd.read_csv(r'assets\patient.csv');

#filtering out newborn
admissionsNewbornfilter = admissionsDF.ADMISSION_TYPE != "NEWBORN"
admissionsDF = admissionsDF[admissionsNewbornfilter]
data = admissionsDF

CCicd9codes = getICD9codes()
new_df = diagnosesDF[(diagnosesDF.ICD9_CODE.isin(map(str,CCicd9codes)))]
temp = new_df.HADM_ID.value_counts()

for i in admissionsDF.index:
    curr = datetime.strptime(admissionsDF.loc[i,'ADMITTIME'], '%Y-%m-%d %H:%M:%S')
    latest = datetime.strptime(admissionsDF.loc[i,'DISCHTIME'], '%Y-%m-%d %H:%M:%S')
    data.loc[i,'StayDuration'] = (latest - curr).days

    pIndex = patientsDF.index[patientsDF['SUBJECT_ID'] == admissionsDF.SUBJECT_ID[i]]

    curr = datetime.strptime(patientsDF.loc[pIndex].DOB.to_string(index=False), '%Y-%m-%d %H:%M:%S')
    latest = datetime.strptime(admissionsDF['ADMITTIME'][i], '%Y-%m-%d %H:%M:%S')
    duration = latest - curr
    duration_in_s = duration.total_seconds()
    age = divmod(duration_in_s, 31536000)[0]
    if age > 90:
        age = 90

    data.loc[i,'AGE']= int(age)
    data.loc[i,'Gender']= patientsDF.loc[pIndex].GENDER.to_string(index=False)

    if data.loc[i,'HADM_ID'] in temp:
        x = temp[data['HADM_ID'][i]]
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
    data.loc[i,'CCscore'] = x



data = data.drop(['ROW_ID','SUBJECT_ID','ADMITTIME','ADMISSION_LOCATION','DISCHTIME','DISCHARGE_LOCATION','LANGUAGE','EDREGTIME','EDOUTTIME','DIAGNOSIS','HOSPITAL_EXPIRE_FLAG','HAS_CHARTEVENTS_DATA'], axis=1)

dataDeath = data.DEATHTIME
data = data.drop('DEATHTIME',axis=1)
dataDeath.loc[~dataDeath.isnull()] = 1
dataDeath.loc[dataDeath.isnull()] = 0

data = pd.get_dummies(data,columns=['ADMISSION_TYPE','Gender','INSURANCE','MARITAL_STATUS','RELIGION','ETHNICITY'])
mortalityData = data.drop(['HADM_ID','StayDuration'],axis=1)

data = data[(data[['StayDuration']] >= 0).all(1)]
DischargeTime = data.StayDuration.astype('int32')
data = data.drop('StayDuration',axis=1)

admissionsDF = data
data = data.drop(['HADM_ID'],axis=1)

results = {}

X_train, X_test, y_train, y_test = train_test_split(data,DischargeTime,test_size=.0001,random_state=0)
expModel = GradientBoostingRegressor(max_depth=2, n_estimators=200)
expModel.fit(X_train, y_train)
y_test_preds = expModel.predict(X_test)
name = 'GradientBoostingRegressor'
y_test_preds = y_test_preds.astype('int32')
y_test = y_test.astype('int32')
results[name] = [r2_score(y_test, y_test_preds),mean_squared_error(y_test, y_test_preds)]

X_train, X_test, y_train, y_test = train_test_split(mortalityData,dataDeath,test_size=.0001,random_state=0)
morModel = GradientBoostingRegressor(max_depth=2, n_estimators=300)
morModel.fit(X_train, y_train)
y_test_preds = morModel.predict(X_test)
name = 'GradientBoostingRegressor'
y_test_preds = y_test_preds.astype('int32')
y_test = y_test.astype('int32')
results[name] = [r2_score(y_test, y_test_preds),mean_squared_error(y_test, y_test_preds)]

def getmorModel(hadm_ID):
    x = admissionsDF[admissionsDF.HADM_ID==hadm_ID].drop(['HADM_ID'],axis=1)
    return morModel.predict(x)
def getexpModel(hadm_ID):
    x = admissionsDF[admissionsDF.HADM_ID==hadm_ID].drop(['HADM_ID'],axis=1)
    return expModel.predict(x)
