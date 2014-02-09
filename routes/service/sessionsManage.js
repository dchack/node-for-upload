var Session = require('./Session');
/**
 * Created with JetBrains WebStorm.
 * User: hackdc
 * Date: 13-12-18
 * Time: 下午1:05
 * To change this template use File | Settings | File Templates.
 */


var SessionsManage = function(expires, clean_time ){
    this.def_expires = expires||100;   // 过期时间
    this.def_clean_time = clean_time||1000;  // 执行清除操作间隔时间
    this.sessions = {}; // session 放置处
    //启动定时任务，就是说不停的会检查去除sessions中过期的的session
    setInterval(this.cleanup, this.def_clean_time, this.sessions);
};

var init = function(expires, clean_time){
    return new SessionsManage(expires, clean_time);
};
module.exports = SessionsManage;
/**
 * 模拟取session
 * @param req
 * @param name
 * @returns {null, session}
 */
SessionsManage.prototype.getSession = function(req, name){
    var id = getIdFromCookies(req);
    if(id){
        // 现货器session对象
        var session = this.sessions[id];
        if(session && session[name]){
            // 再从session对象中找对应的值
            return session[name];
        }else {
            return null;
        }
    }else{
        return null;
    }
};

/**
 * 模拟存session
 * @param req
 * @param res
 * @param opts
 * @returns {boolean}
 */
SessionsManage.prototype.setSession = function(req, res, opts){
    if(!opts){
        return false;
    }else{
        // 从cookie中获取id
        var id = getIdFromCookies(req) || randomString(36);
        var name = opts.name;
        var value = opts.value;
        var expires = opts.expires || this.def_expires;
        if(id && value && name){
            // 新创一个session
            var session = new Session();
            session[name] = value;
            session["id"] = id;
            session["overLifeTime"] = (+new Date) + expires*1000;
            // 放置进sessions
            this.sessions[id] = session;
            // 写入返回客户端的cookie中
            this.setCookieId(res, id, expires);
        }
    }
};

SessionsManage.prototype.setSession2 = function(req, res, opts){
    if(!opts){
        return false;
    }else{
        // 从cookie中获取id
        var id = getIdFromCookies(req) || randomString(36);
        var name = opts.name;
        var value = opts.value;
        var expires = opts.expires || this.def_expires;
        if(id && value && name){
            // 新创一个session
            var session = new Session();
            session[name] = value;
            session["id"] = id;
            session["overLifeTime"] = (+new Date) + expires*1000;
            // 放置进sessions
            this.sessions[id] = session;
            // 写入返回客户端的cookie中
            //this.setCookieId(res, id, expires);
        }
    }
};


SessionsManage.prototype.setCookieId = function(res, id, expires){
    // config cookie
    var d = new Date();
    d.setTime(d.getTime() + expires*1000); // in milliseconds
    res.setHeader(
        'Set-Cookie', 'D_SID='+ id +';expires='+d.toGMTString()+';'
    );
};

SessionsManage.prototype.cleanup = function(sessions){
    var now = new Date().getTime();
    for(var id in sessions){
        var session = sessions[id];
        if(session.overLifeTime < now){
            delete sessions[session.id];
        }
    }
};

var getIdFromCookies = function(req){
    // client's Cookie
    var Cookies = {};
    req.headers.cookie && req.headers.cookie.split(';').forEach(function( Cookie ) {
        var parts = Cookie.split('=');
        Cookies[ parts[ 0 ].trim() ] = ( parts[ 1 ] || '' ).trim();
    });
//    console.info(Cookies);
//    console.info(Cookies["D_SID"]);
    if(Cookies["D_SID"]){
        return Cookies["D_SID"];
    }else{
        return null;
    }
};

function randomString(bits){
    return new Date().getTime();
}
