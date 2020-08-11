//this Models Name
var model_name = "Books"
var autoInc = require('mongoose-auto-increment')

var {validator} = require('validator')
module.exports = function(mongoose, models){
    autoInc.initialize(mongoose.connection)
    const Schema = mongoose.Schema;
    let _model = new Schema(
        {
            isbn:{ type: String, required: true, unique:false},
            name:{ type: String, required: true, unique:false},
            author:{ type: String, required: true},
            publish_date:{type: Date, required: true},
            summary:{ type: String, required: true},
 
        },
        {   
            timestamps: true,
        }
        
    );
    _model.plugin(require('mongoose-bcrypt'));
    _model.plugin(autoInc.plugin, 'Book');
    //Add your Schema custom methods or statics here//
    //reference: https://mongoosejs.com/docs/guide.html#methods//
    _model.static('print_hi', function() {
        console.log("hi")
    });

    //End of Schema methods//

    models[model_name]=mongoose.model(model_name, _model);
}

