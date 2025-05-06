import {ExportStateType} from "./types";
import {HPGFormat} from "./hpg";
import {NPKElements} from "../types";
import {normalizeConcentration} from "../dilution";


describe("HPG", () => {
  // test("export", () => {
  //   let f = new HPGFormat()
  //   f.export(EXAMPLE_STATE)
  // })
  test("import", () => {
    let f = new HPGFormat()
    expect(f.import(EXAMPLE_FILE)).toEqual(EXPECT_STATE)
  })

  const stringProfile = 'N=230 NO3=209.09 NH4=20.91 P=60 K=245 Ca=166 Mg=49 S=51.5 Cl=0 Fe=2.801 Mn=0.445 B=0.5 Zn=0.269 Cu=0.048 Mo=0.048 Co=0.048 Si=0'
  const npkProfle: NPKElements = {
    "B": 0.5,
    "Ca": 166,
    "Cl": 0,
    "Co": 0.048,
    "Cu": 0.048,
    "Fe": 2.801,
    "K": 245,
    "Mg": 49,
    "Mn": 0.445,
    "Mo": 0.048,
    "NH4": 20.91,
    "NO3": 209.09,
    "P": 60,
    "S": 51.5,
    "Si": 0,
    "Zn": 0.269
  }

  test("parse profile string", () => {
    const npk = HPGFormat.parseProfileString(stringProfile)
    expect(npk).toEqual(npkProfle)
  })

  test("stringify profile", () => {
    const string = HPGFormat.stringifyProfile(npkProfle)
    expect(string).toEqual(stringProfile)
  })
})


export const EXAMPLE_FILE = `version=Hydroponic Profile Generator 0.213 https://github.com/siv237/HPG
Comment=По умолчанию
N=215.991
NH4=19.65
NO3=196.34
P=59.986
K=243.427
Ca=166.83
Mg=49.238
S=64.958
Cl=0
CaNO3_Ca=20.316
CaNO3_NO3=14.2
CaNO3_NH4=0
KNO3_K=37.963
KNO3_NO3=13.6
NH4NO3_NH4=17.4
NH4NO3_NO3=17.4
MgSO4_Mg=10.183
MgSO4_S=13.434
KH2PO4_K=27.33
KH2PO4_P=21.651
K2SO4_K=41.611
K2SO4_S=17.063
MgNO3_Mg=9.479
MgNO3_NO3=10.925
CaCl2_Ca=18.294
CaCl2_Cl=32.366
Fe=2801
Mn=445
B=500
Zn=269
Cu=48
Mo=48
Co=48
Si=0
dFe=0.4
dMn=0.0636
dB=0.0714
dZn=0.0384
dCu=0.0069
dMo=0.0069
dCo=0
dSi=0
glCaNO3=493
glKNO3=250
glNH4NO3=336.6
glMgNO3=250
glMgSO4=250
glK2SO4=100
glKH2PO4=200
glCaCl2=100
glCmplx=10
glFe=10
glMn=10
glB=10
glZn=10
glCu=10
glMo=10
glCo=10
glSi=10
gmlCaNO3=1.281
gmlKNO3=1.1419
gmlNH4NO3=1.104
gmlMgNO3=1
gmlMgSO4=1.119
gmlK2SO4=1.075
gmlKH2PO4=1.1253
gmlCaCl2=1
gmlCmplx=1
gmlFe=1
gmlMn=1
gmlB=1
gmlZn=1
gmlCu=1
gmlMo=1
gmlCo=1
gmlSi=1
chkComplex=FALSE
chK2SO4=TRUE
chMgNO3=FALSE
V=17
mCaNO3=p1
mKNO3=p2
mNH4NO3=p3
mMgNO3=
mMgSO4=p4
mKH2PO4=p5
mK2SO4=p6
mCaCl2=
mCmplx=p7
mFe=
mMn=
mB=
mZn=
mCu=
mMo=
mCo=
mSi=
addrMixer=mixer-esp32.local
tAml=500
tBml=500
cgCaNO3=0.4
cgKNO3=0.35
cgNH4NO3=0.25
cgMgNO3=0.35
cgMgSO4=0.12
cgK2SO4=0.32
cgKH2PO4=0.4
cgCaCl2=7.7
cgCmplx=0.05
cgFe=3
cgMn=0.3
cgB=0.4
cgZn=0.15
cgCu=0.4
cgMo=3
cgCo=2.3
cgSi=0.27
date=2021-02-05;Корректор. Скорректирован раствор до 20 литров.;N=210 NO3=191 NH4=19.1 P=60 K=223.75 Ca=186.46 Mg=44.75 S=72.2 Cl=0 Fe=2.801 Mn=0.445 B=0.5 Zn=0.269 Cu=0.048 Mo=0.048 Co=0.048 Si=0 
date=2021-02-05;Старый профиль;N=230 NO3=209.09 NH4=20.91 P=60 K=245 Ca=166 Mg=49 S=51.5 Cl=0 Fe=2.801 Mn=0.445 B=0.5 Zn=0.269 Cu=0.048 Mo=0.048 Co=0.048 Si=0 
date=2021-02-08;Автозапись. Изготовлен раствор на 15 литров.;N=206 NO3=187.16 NH4=18.72 P=60 K=247.05 Ca=167.38 Mg=49.41 S=76.6 Cl=0 Fe=2.801 Mn=0.445 B=0.5 Zn=0.269 Cu=0.048 Mo=0.048 Co=0.048 Si=0 
date=2021-02-21;Автозапись. Изготовлен раствор на 17 литров.;N=216 NO3=196.34 NH4=19.65 P=59.99 K=243.43 Ca=166.83 Mg=49.24 S=65 Cl=0 Fe=2.801 Mn=0.445 B=0.5 Zn=0.269 Cu=0.048 Mo=0.048 Co=0.048 Si=0 
`

let _fertilizers = [
  {
    "id": "CaNO3",
    "npk": {
      "Ca": 28.422,
      "NO3": 14.2
    },
    "pump_number": 1,
    "solution_concentration": 493,
    "solution_density": 1281
  },
  {
    "id": "KNO3",
    "npk": {
      "K": 45.745,
      "NO3": 13.6
    },
    "pump_number": 2,
    "solution_concentration": 250,
    "solution_density": 1141.8999999999999
  },
  {
    "id": "NH4NO3",
    "npk": {
      "NH4": 17.4,
      "NO3": 17.4
    },
    "pump_number": 3,
    "solution_concentration": 336.6,
    "solution_density": 1104
  },
  {
    "id": "MgSO4",
    "npk": {
      "Mg": 16.883,
      "S": 13.434
    },
    "pump_number": 4,
    "solution_concentration": 250,
    "solution_density": 1119
  },
  {
    "id": "KH2PO4",
    "npk": {
      "K": 32.933,
      "P": 49.602
    },
    "pump_number": 5,
    "solution_concentration": 200,
    "solution_density": 1125.3
  },
  {
    "id": "K2SO4",
    "npk": {
      "K": 50.141,
      "S": 17.063
    },
    "pump_number": 6,
    "solution_concentration": 100,
    "solution_density": 1075
  },
  {
    "id": "MgNO3",
    "npk": {
      "Mg": 15.716,
      "NO3": 10.925
    },
    "solution_concentration": 250,
    "solution_density": 1000
  },
  {
    "id": "CaCl2",
    "npk": {
      "Ca": 25.593,
      "Cl": 32.366
    },
    "solution_concentration": 100,
    "solution_density": 1000
  },
  {
    "composition": [
      {
        "formula": "Fe",
        "percent": 0.4
      }
    ],
    "id": "Fe",
    "solution_concentration": 10,
    "solution_density": 10
  },
  {
    "composition": [
      {
        "formula": "Mn",
        "percent": 0.0636
      }
    ],
    "id": "Mn",
    "solution_concentration": 10,
    "solution_density": 10
  },
  {
    "composition": [
      {
        "formula": "B",
        "percent": 0.0714
      }
    ],
    "id": "B",
    "solution_concentration": 10,
    "solution_density": 10
  },
  {
    "composition": [
      {
        "formula": "Zn",
        "percent": 0.0384
      }
    ],
    "id": "Zn",
    "solution_concentration": 10,
    "solution_density": 10
  },
  {
    "composition": [
      {
        "formula": "Cu",
        "percent": 0.0069
      }
    ],
    "id": "Cu",
    "solution_concentration": 10,
    "solution_density": 10
  },
  {
    "composition": [
      {
        "formula": "Mo",
        "percent": 0.0069
      }
    ],
    "id": "Mo",
    "solution_concentration": 10,
    "solution_density": 10
  }
]

const EXPECT_STATE: ExportStateType = {
  "calculator": {
    "calculationForm": {
      "accuracy": 0.01,
      "dilution_concentration": normalizeConcentration(1),
      "dilution_enabled": true,
      "dilution_volume": 17,
      "fertilizers": _fertilizers.filter(f => f.id !== 'MgNO3'),
      "recipe": {
        "B": 0.5,
        "Ca": 166.83,
        "Cl": 0,
        "Co": 0.048,
        "Cu": 0.048,
        "Fe": 2.801,
        "K": 243.427,
        "Mg": 49.238,
        "Mn": 0.445,
        "Mo": 0.048,
        "NH4": 19.65,
        "NO3": 196.34,
        "P": 59.986,
        "S": 64.958,
        "Si": 0,
        "Zn": 0.269
      },
      "mixerOptions": {
        "url": "mixer-esp32.local",
      },
      "solution_concentration": normalizeConcentration(34),
      "solution_volume": 0.5
    }, "fertilizers": _fertilizers, "recipes": [], "result": null
  }, "meta": {
    "created": "", "ref": "", "version": "Hydroponic Profile Generator 0.213 https://github.com/siv237/HPG"
  }
}
