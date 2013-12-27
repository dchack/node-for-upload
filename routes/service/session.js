/**
 * Created with JetBrains WebStorm.
 * User: hackdc
 * Date: 13-12-19
 * Time: 下午4:45
 * To change this template use File | Settings | File Templates.
 */



var Session = function(opt){
    if(opt){
        this.id = opt.id;
        this.overLifeTime = opt.expires;
    }
};
module.exports = Session;