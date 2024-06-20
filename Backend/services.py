import json
from flask import Flask, jsonify;
import pandas as pd;
from riskscorecal import getPatientSample;
from patientDetails import setPatientDetails;
from flask_cors import CORS;
import predictiveModels as pm;


app = Flask(__name__)
CORS(app,origins=['http://localhost:4200'])

def sharepatientsData():
    patientsData = getPatientSample()
    return patientsData

patientsData = sharepatientsData()

@app.route('/piedata')
def get_piedata():

    temp = patientsData.Riskgroup.value_counts()
    data = [
        {
            'Urgent' : str(temp['Urgent']),
            'High' : str(temp['High']),
            'Medium' : str(temp['Medium']),
            'Low' : str(temp['Low']),
        }
    ]
    return jsonify(data)

def get_average(data):
    labels = [0,0,0,0,0,0,0,0,0,0]
    count = [0,0,0,0,0,0,0,0,0,0]
    ret = []
    for i in data.index:
        x = int(i/10)%10
        labels[x]+=data[i]
        count[x]+=1
    for i in range(10):
        if count[i] != 0:
            x = labels[i]/count[i]
        else:
            x = 0
        ret.append("{:.2f}".format(x))
    return ret

@app.route('/linechart')
def get_linedata():

    data = patientsData.groupby('AGE')["Riskscore"].mean()
    ret = []

    # bins= [0,10,20,30,40,50,60,70,80,90,1000]
    labels = [0,0,0,0,0,0,0,0,0,0]
    count = [0,0,0,0,0,0,0,0,0,0]

    # ret[1] = pd.cut(data.index, bins=bins, labels=labels, right=False)

    for i in data.index:
        x = int(i/10)%10
        labels[x]+=data[i]
        count[x]+=1
    for i in range(10):
        x = labels[i]/count[i]
        if x > 3:
            x ="Urgent"
        elif x >2:
            x ="High"
        elif x >1:
            x ="Medium"
        else:
            x ="Low"
        ageGroup = str(i*10)+"-"+str((i*10)+9)
        if i == 9:
            curr = {"90-":x}
        else:
            curr = {
                ageGroup : x
            }
        ret.append(curr)
    return jsonify(ret)

@app.route('/bardata')
def get_bardata():

    data =  patientsData.groupby('AGE')
    ccScore = data['CCscore'].mean()
    edScore = data['EDscore'].mean()
    riskScore = data['Riskscore'].mean()
    data = [
        {
            'ccScore' : get_average(ccScore),
            'edScore' :  get_average(edScore),
            'riskScore' :  get_average(riskScore)
        }
    ]
    return data

@app.route('/topten')
def get_toptendata():
    temp = patientsData.query("Riskscore == 4.0").sample(10)
    temp['expectedStay'] = 0
    temp['survivalRate'] = 0
    for i in temp.index:
        hadmID = int(temp.HADM_ID[temp.index == i].to_string(index=False))
        temp.loc[i,'expectedStay'] =  str(int(pm.getexpModel(hadmID)))
        temp.loc[i,'survivalRate'] =   str(100 - int(pm.getmorModel(hadmID)*100))
    temp = temp.to_json(orient ='records')
    return temp

@app.route('/admitcount')
def get_admitcount():
  admissionsDF = pd.read_csv(r'assets\admissions.csv');
  temp = admissionsDF.query("HADM_ID in @patientsData.HADM_ID").ADMISSION_TYPE.value_counts()
  temp = [{
    'EMERGENCY':str(temp['EMERGENCY']),
    'ELECTIVE':str(temp['ELECTIVE']),
    'URGENT':str(temp['URGENT'])
  }]
  return temp

@app.route('/patientslist')
def get_patientslist():
    temp = patientsData.to_json(orient ='records')
    return temp

@app.route('/patientDetails/<hadmID>')
def get_patientDetails(hadmID):

    temp = setPatientDetails(hadmID)
    hadmID = int(hadmID)
    temp['AGE'] = patientsData.AGE[patientsData.HADM_ID==hadmID].to_string(index=False)
    temp['Riskscore']= patientsData.Riskscore[patientsData.HADM_ID==hadmID].to_string(index=False)
    temp['EDscore']= patientsData.EDscore[patientsData.HADM_ID==hadmID].to_string(index=False)
    temp['CCscore']= patientsData.CCscore[patientsData.HADM_ID==hadmID].to_string(index=False)
    temp['expectedStay'] = str(int(pm.getexpModel(hadmID)))
    temp['survivalRate'] = str(100 - int(pm.getmorModel(hadmID)*100))

    return jsonify([temp])
