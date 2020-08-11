module.exports = function(models){

    let business = new models.Businesses({
        username:"User1",
        password:"password",
        name:"MedConglomerate",
        category:"Eye Clinic",
        description:"Eye Clinic",
        addressline1:"Address 1",
        addressline2:"Address 2",
        city:"Delhi",
        state:"Big",
        country:"India",
        zipcode:"1234",
        account_type:"Premium",
        whatsapp_number:"whatsapp:+14155238886",
        phone_number:"+14155238886",
        status:"open"
      })
  
      business.save()
        .then(doc => {
          console.log(doc)
        })
        .catch(err => {
          console.error(err)
        })

    let branch = new models.Branches({
      business_id:business._id,
      name:"Branch1",
      username:"user",
      password:"password",
      addressline1:"Address1",
      addresslline2:"Address2",
      city:"Delhi",
      state:"Big",
      country:"India",
      zipcode:"1234",
      phone_number:"5451237",
      latitude:"100.2",
      longitude:"40.45",
      status:"open"  
    })

    branch.save()
      .then(doc => {
        console.log(doc)
      })
      .catch(err => {
        console.error(err)
      })
    

  let time = new models.TimePeriods({
      datetime: new Date("2020-03-05T08:30:00.000"),
      branch_id:branch._id,
      no_of_slots:4,
      slots_taken:4,
    })

  time.save().then(doc => {
    console.log(doc)
  })
  .catch(err => {
    console.error(err)
  })

  time = new models.TimePeriods({
    datetime:"2020-03-05T10:30:00.000",
    branch_id:branch._id,
    no_of_slots:4,
    slots_taken:3,
  })

  time.save().then(doc => {
    console.log(doc)
  })
  .catch(err => {
    console.error(err)
  })

  time = new models.TimePeriods({
    datetime:"2020-03-05T14:30:00.000",
    branch_id:branch._id,
    no_of_slots:4,
    slots_taken:3,
  })

  time.save().then(doc => {
    console.log(doc)
  })
  .catch(err => {
    console.error(err)
  })
  

  time = new models.TimePeriods({
      datetime:"2020-03-06T08:30:00.000",    
      branch_id:branch._id,  
      no_of_slots:4,
      slots_taken:0,
    })

  time.save().then(doc => {
    console.log(doc)
  })
  .catch(err => {
    console.error(err)
  })

  time = new models.TimePeriods({
    datetime:"2020-03-06T10:30:00.000",
    branch_id:branch._id,
    no_of_slots:4,
    slots_taken:0,
  })

  time.save().then(doc => {
    console.log(doc)
  })
  .catch(err => {
    console.error(err)
  })

  time = new models.TimePeriods({
    datetime:"2020-03-06T14:30:00.000",
    branch_id:branch._id,
    no_of_slots:4,
    slots_taken:0,
  })

  time.save().then(doc => {
    console.log(doc)
  })
  .catch(err => {
    console.error(err)
  })
}