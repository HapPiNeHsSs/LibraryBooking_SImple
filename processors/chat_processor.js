let name="chat_processor"

Date.prototype.addHours= function(h){
    this.setHours(this.getHours()+h);
    return this;
}

async function getBranchesInCity(models, city){    
    console.log("city her: ", city)
    branches = await models.Branches.find({ city: new RegExp(city, "i")}).lean()
    console.log(branches)
    return branches
}

async function findEarliestSlotInCity(models, city){  
    console.log(new Date());
    console.log(new Date().addHours(4));
    let d = new Date().addHours(4)
    branches = await getBranchesInCity(models, city) 
    let timeperiod = {}  
    for (i in branches){
        branch = branches[i]
         
        var qw = {
            datetime: { 
                $gt: d
            },
            $where:"this.no_of_slots > this.slots_taken",
            branch_id: branch._id
        }
        timeperiod = await models.TimePeriods.find(qw).sort({'datetime': 'asc'}).lean()
    }

   
    return timeperiod[0]
}


module.exports.init = function(message,models){
    let customer = new models.Customers({        
        botkit_user_id: message.user,
        status: "InputCity",
        phone_number: message.user
    })

    customer.save()
    .then(doc => {
        console.log(doc)
    })
    .catch(err => {
        console.error(err)
    })

    //create appointment
    let appointment = new models.Appointments({        
        customer_id:customer._id,                               
        status:"initiated",
    })

    appointment.save()
    .then(doc => {
        console.log(doc)
    })
    .catch(err => {
        console.error(err)
    })
}

module.exports.lookForBooking = async function(message, models, city){
    let timeperiod = await findEarliestSlotInCity(models, city)
    console.log("time",timeperiod)
    let customer = await models.Customers.findOne({botkit_user_id: message.user})
    let appointment = await models.Appointments.findOne({customer_id: customer._id})
    //customer.status="SlotMenu"
    appointment.status="unconfirmed"
    appointment.timeperiod_id = timeperiod._id
    appointment.save()    
    return timeperiod

}

module.exports.confirm = async function(message, models){
    let customer = await models.Customers.findOne({botkit_user_id: message.user})
    let appointment = await models.Appointments.findOne({customer_id: customer._id})
    let timeperiod = await models.TimePeriods.findOne({_id: appointment.timeperiod_id})
    console.log(appointment)
    if (timeperiod.no_of_slots > timeperiod.slots_taken){
        appointment.status = "confirmed"
        appointment.branch_id = timeperiod.branch_id
        customer.last_booked_branch = timeperiod.branch_id
        timeperiod.slots_taken = timeperiod.slots_taken+1
        //customer.status="InputName"
        appointment.save()
        timeperiod.save()
        customer.save()
        return appointment
    }
    else{return false}
}

module.exports.inputName = async function(message, models, name){
    let customer = await models.Customers.findOne({botkit_user_id: message.user})
    let appointment = await models.Appointments.findOne({customer_id: customer._id})
    customer.name = name;   
    customer.status="Processed/Done"
    customer.save()

    appointment.requester_name = customer.name
    appointment.phone_number = customer.phone_number
    appointment.save()
    return appointment
}

module.exports.name = name;
