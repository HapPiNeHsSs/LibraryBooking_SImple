//this Models Name
var model_name = "Users"
const passportLocalMongoose = require('passport-local-mongoose');
var {validator} = require('validator')
module.exports = function(mongoose, models){
    console.log("starts")
    const Schema = mongoose.Schema;
    let _model = new Schema(
        {
            username:{
                type: String,
                required: true,
                unique: true,
                lowercase: true},
            password:{ type: String},
            customer_name:{ type: String},
        },
        {   
            timestamps: true,
        }
    );

    //make this one a Passport schema
    _model.plugin(passportLocalMongoose);

    //Add your Schema custom methods or statics here//
    //reference: https://mongoosejs.com/docs/guide.html#methods//
    _model.static('print_hi', function() {
        console.log("hi")
    });

    
    //End of Schema methods//
    models[model_name]=mongoose.model(model_name, _model);
}




