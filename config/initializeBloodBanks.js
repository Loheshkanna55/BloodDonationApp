const BloodBank = require('../models/BloodBank');

const bloodBanksData = [
  {
    location: "Kanniyakumari",
    addresses: [
      "Government Medical College, Asaripallam, Kanniyakumari - 629201",
      "Holy Cross Hospital Blood Bank, Nagercoil - 629004",
      "Annai Hospital Blood Bank, Kottaram, Kanniyakumari - 629702"
    ],
    "A+": 2500,
    "A-": 1300,
    "B+": 2750,
    "B-": 1800,
    "AB+": 50,
    "AB-": 900,
    "O+": 4100,
    "O-": 2200
  },
  {
    location: "Kallakurichi",
    addresses: [
      "Government District Hospital Blood Bank, Kallakurichi - 606202",
      "Maha Blood Bank, Near Bus Stand, Kallakurichi - 606213",
      "Annai Blood Bank, Ulundurpet, Kallakurichi - 607302"
    ],
    "A+": 0,
    "A-": 0,
    "B+": 0,
    "B-": 0,
    "AB+": 500,
    "AB-": 0,
    "O+": 0,
    "O-": 0
  },
  {
    location: "Chennai",
    addresses: [
      "Apollo Blood Bank, Greams Road, Chennai - 600006",
      "Rajiv Gandhi Govt. Hospital, Park Town, Chennai - 600003",
      "Rotary Central-TTK Blood Bank, Nungambakkam, Chennai - 600034"
    ],
    "A+": 3200,
    "A-": 1500,
    "B+": 4000,
    "B-": 2200,
    "AB+": 1300,
    "AB-": 800,
    "O+": 5000,
    "O-": 2700
  },
  {
    location: "Kanchipuram",
    addresses: [
      "Government Hospital Blood Bank, Kanchipuram - 631501",
      "Meenakshi Medical College Hospital, Enathur, Kanchipuram - 631552",
      "Sri Narayani Hospital Blood Bank, Sriperumbudur, Kanchipuram - 631604"
    ],
    "A+": 2600,
    "A-": 1300,
    "B+": 3200,
    "B-": 1800,
    "AB+": 1150,
    "AB-": 850,
    "O+": 4300,
    "O-": 2400
  },
  {
    location: "Karur",
    addresses: [
      "Government Medical College Blood Bank, Karur - 639007",
      "Apollo Hospital Blood Bank, Coimbatore Road, Karur - 639002",
      "Sri Hospital Blood Bank, Thirugampuliur, Karur - 639001"
    ],
    "A+": 0,
    "A-": 0,
    "B+": 0,
    "B-": 0,
    "AB+": 0,
    "AB-": 0,
    "O+": 0,
    "O-": 0
  },
  {
    location: "Theni",
    addresses: [
      "Government Medical College Blood Bank, Theni - 625531",
      "Apollo Blood Bank, Periyakulam Road, Theni - 625534",
      "Kumaran Blood Bank, Andipatti, Theni - 625512"
    ],
    "A+": 0,
    "A-": 0,
    "B+": 0,
    "B-": 0,
    "AB+": 0,
    "AB-": 0,
    "O+": 0,
    "O-": 0
  },
  {
    location: "Tiruchirappalli",
    addresses: [
      "Kauvery Hospital Blood Bank, Tennur, Trichy - 620017",
      "ABC Blood Bank, Puthur, Trichy - 620001",
      "SRM Medical College, Irungalur, Trichy - 621105"
    ],
    "A+": 2800,
    "A-": 1400,
    "B+": 2450,
    "B-": 1900,
    "AB+": 700,
    "AB-": 1000,
    "O+": 4500,
    "O-": 2400
  },
  {
    location: "Ranipet",
    addresses: [
      "Government District Hospital Blood Bank, Ranipet - 632403",
      "Apollo KH Blood Bank, Arcot Road, Ranipet - 632505",
      "Star Blood Bank, Sholinghur, Ranipet - 632601"
    ],
    "A+": 0,
    "A-": 0,
    "B+": 0,
    "B-": 0,
    "AB+": 0,
    "AB-": 0,
    "O+": 0,
    "O-": 0
  },
  {
    location: "Coimbatore",
    addresses: [
      "Ganga Multi Specialty Hospital, Coimbatore - 641009",
      "Kovai Medical Center, Coimbatore - 641014",
      "Sri Ramakrishna Hospital, Coimbatore - 641005"
    ],
    "A+": 3100,
    "A-": 1600,
    "B+": 3800,
    "B-": 2100,
    "AB+": 900,
    "AB-": 750,
    "O+": 4800,
    "O-": 2600
  },
  {
    location: "Salem",
    addresses: [
      "Government Hospital Blood Bank, Salem - 636001",
      "Apollo Hospital Blood Bank, Salem - 636004",
      "Sudha Hospital Blood Bank, Salem - 636003"
    ],
    "A+": 2400,
    "A-": 1200,
    "B+": 2600,
    "B-": 1700,
    "AB+": 600,
    "AB-": 800,
    "O+": 4000,
    "O-": 2200
  },
  {
    location: "Madurai",
    addresses: [
      "Government Medical College Hospital, Madurai - 625020",
      "Meenakshi Mission Hospital, Madurai - 625002",
      "Sri Ramakrishna Hospital, Madurai - 625001"
    ],
    "A+": 2900,
    "A-": 1450,
    "B+": 3100,
    "B-": 1950,
    "AB+": 800,
    "AB-": 950,
    "O+": 4700,
    "O-": 2500
  },
  {
    location: "Erode",
    addresses: [
      "Government Medical College Hospital, Erode - 638001",
      "Apollo Hospital Blood Bank, Erode - 638001",
      "GHospital Blood Bank, Erode - 638001"
    ],
    "A+": 0,
    "A-": 0,
    "B+": 0,
    "B-": 0,
    "AB+": 0,
    "AB-": 0,
    "O+": 0,
    "O-": 0
  },
  {
    location: "Vellore",
    addresses: [
      "Christian Medical College Hospital, Vellore - 632004",
      "Government Hospital Blood Bank, Vellore - 632001",
      "Sri Ramakrishna Hospital Blood Bank, Vellore - 632001"
    ],
    "A+": 2700,
    "A-": 1350,
    "B+": 3300,
    "B-": 1850,
    "AB+": 1000,
    "AB-": 900,
    "O+": 4400,
    "O-": 2450
  },
  {
    location: "Tiruppur",
    addresses: [
      "Government Hospital Blood Bank, Tiruppur - 641601",
      "Sri Ramakrishna Hospital Blood Bank, Tiruppur - 641604",
      "Lakshmi Hospital Blood Bank, Tiruppur - 641603"
    ],
    "A+": 0,
    "A-": 0,
    "B+": 0,
    "B-": 0,
    "AB+": 0,
    "AB-": 0,
    "O+": 0,
    "O-": 0
  },
  {
    location: "Thanjavur",
    addresses: [
      "Government Medical College Hospital, Thanjavur - 613004",
      "Sri Ramakrishna Hospital Blood Bank, Thanjavur - 613001",
      "Aravind Eye Hospital Blood Bank, Thanjavur - 613007"
    ],
    "A+": 2200,
    "A-": 1100,
    "B+": 2400,
    "B-": 1600,
    "AB+": 500,
    "AB-": 700,
    "O+": 3800,
    "O-": 2100
  },
  {
    location: "Tirunelveli",
    addresses: [
      "Government Hospital Blood Bank, Tirunelveli - 627001",
      "Christian Medical College Blood Bank, Tirunelveli - 627002",
      "Aravind Eye Hospital Blood Bank, Tirunelveli - 627001"
    ],
    "A+": 2100,
    "A-": 1050,
    "B+": 2300,
    "B-": 1550,
    "AB+": 450,
    "AB-": 650,
    "O+": 3600,
    "O-": 2000
  },
  {
    location: "Ariyalur",
    addresses: [
      "Government Hospital Blood Bank, Ariyalur - 621704",
      "Sri Ramakrishna Hospital Blood Bank, Ariyalur - 621704",
      "Anand Hospital Blood Bank, Ariyalur - 621704"
    ],
    "A+": 0,
    "A-": 0,
    "B+": 0,
    "B-": 0,
    "AB+": 0,
    "AB-": 0,
    "O+": 0,
    "O-": 0
  }
];

const initializeBloodBanks = async () => {
  try {
    const existingCount = await BloodBank.countDocuments();

    if (existingCount === 0) {
      console.log("Initializing blood banks collection...");
      await BloodBank.insertMany(bloodBanksData);
      console.log(`Successfully inserted ${bloodBanksData.length} blood banks`);
    } else {
      console.log(`Blood banks already initialized (${existingCount} records found)`);
    }
  } catch (error) {
    if (error.code === 11000) {
      console.log("Blood banks already exist in database");
    } else {
      console.error("Error initializing blood banks:", error.message);
    }
  }
};

module.exports = initializeBloodBanks;
