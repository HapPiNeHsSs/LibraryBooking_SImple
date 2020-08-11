//this Models Name
var model_name = "Borrows"
var autoInc = require('mongoose-auto-increment')

var {validator} = require('validator')
module.exports = function(mongoose, models){
    autoInc.initialize(mongoose.connection)
    const Schema = mongoose.Schema;    
    let _model = new Schema(
        {
            book:[{ type: Schema.Types.Number, ref: 'Books' }], //must be of type Branch. See usage https://mongoosejs.com/docs/populate.html,},
            user:[{ type: Schema.Types.ObjectId, ref: 'Users' }], 
            borrow_date:{ type: Date, default: Date.now},
            expiry_date:{ type: Date, default: Date.now},
            returned:{ type: Boolean},
            return_date: { type: Date},
            
        },
        {   
            timestamps: true,
        }
    );
    _model.plugin(require('mongoose-bcrypt'));
    _model.plugin(autoInc.plugin, 'Borrows');
    //Add your Schema custom methods or statics here//
    //reference: https://mongoosejs.com/docs/guide.html#methods//
    _model.static('print_hi', function() {
        console.log("hi")
    });
    //End of Schema methods//

    models[model_name]=mongoose.model(model_name, _model);
}

