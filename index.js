var util = require('util');

class Queries{
    
    constructor(con){
        this.con = con;
        this.con.query = util.promisify(this.con.query);
    }
    
    select(data){
        
        var result;
        
        if(typeof data.keys !== 'undefined'){
            
            var counter = true;
            var keys = "";
            for(var i=0;i<data.keys.length;i++){
                if(counter){
                    keys = data.table + "." + data.keys[i];
                    counter = false
                } else {
                    keys = keys + ", " + data.table + "." + data.keys[i];
                }
            }
            
            if(typeof data.join !== 'undefined'){
                for(var i=0; i<data.join.length; i++){
                    for(var j=0; j<data.join[i].keys.length; j++){
                        keys = keys + ", " + data.join[i].table + "." + data.join[i].keys[j];
                    }
                }
            }
            
            var sql = "SELECT " + keys + " FROM " + data.table + (function(){
                if(typeof data.where !== 'undefined'){
                    var values;
                    var counter = true;
                    for(var key in data.where){
                        if(typeof data.where[key] === 'string'){
                            data.where[key] = "'" + data.where[key] + "'";
                        }
                        if(counter){
                            values = key + "=" + data.where[key];
                            counter = false;
                        } else {
                            values = values + " AND " + key + "=" + data.where[key];
                        }
                    }
                    var s = " WHERE " + values;
                    return s
                } else {return ""}
            })() + (function(){
                if(typeof data.orderby !== 'undefined'){
                    var s = " ORDER BY " + data.orderby;
                    return s
                } else {return ""}
            })() + (function(){
                if(typeof data.join !== 'undefined'){
                    var s="";
                    for(var i=0; i<data.join.length; i++){
                        s = s + " JOIN " + data.join[i].table + " ON " + data.table + "." + (function(){
                            var keys;
                            for(var key in data.join[i].on){
                                keys = key;
                            }
                            return keys
                        })() + "=" + data.join[i].table + "." + (function(){
                            var value;
                            for(var key in data.join[i].on){
                                value = data.join[i].on[key];
                            }
                            return value
                        })();
                    }
                    return s;
                } else {return ""}
            })();
            
            try{
                result = this.con.query(sql);
            } catch(e) {
                throw new Error(e);
            }
            
            console.log(result.sql);
            
            return result
            
        } else {
            var sql = "SELECT * FROM " + data.table + (function(){
                if(typeof data.where !== 'undefined'){
                    var values;
                    var counter = true;
                    for(var key in data.where){
                        if(typeof data.where[key] === 'string'){
                            data.where[key] = "'" + data.where[key] + "'";
                        }
                        if(counter){
                            values = key + "=" + data.where[key];
                            counter = false;
                        } else {
                            values = values + " AND " + key + "=" + data.where[key];
                        }
                    }
                    var s = " WHERE " + values;
                    return s
                } else {return ""}
            })() + (function(){
                if(typeof data.orderby !== 'undefined'){
                    var s = " ORDER BY " + data.orderby;
                    return s
                } else {return ""}
            })() + (function(){
                if(typeof data.join !== 'undefined'){
                    var s="";
                    for(var i=0; i<data.join.length; i++){
                        s = s + " JOIN " + data.join[i].table + " ON " + data.table + "." + (function(){
                            var keys;
                            for(var key in data.join[i].on){
                                keys = key;
                            }
                            return keys
                        })() + "=" + data.join[i].table + "." + (function(){
                            var value;
                            for(var key in data.join[i].on){
                                value = data.join[i].on[key];
                            }
                            return value
                        })();
                    }
                    return s;
                } else {return ""}
            })();
            try{
                result = this.con.query(sql);
            } catch(e) {
                throw new Error(e);
            }
            
            console.log(result.sql);

            return result            
        }
                
    }
    
    insert(data){
        var result;
        var counter = true;
        var keys;
        var values;
        for(var key in data.data){
            if(typeof data.data[key] === 'string'){
                data.data[key] = "'" + data.data[key] + "'";
            }
            if(counter){
                keys = "" + key;
                values = "" + data.data[key];
                counter = false;
            } else {
                keys = keys + ", " + key;
                values = values + ", " + data.data[key];
            }
        }
        
        var sql = "INSERT INTO " + data.table + " (" + keys + ") VALUES (" + values + ")";
        
        try{
            result = this.con.query(sql);
        } catch(e){
            throw new Error(e);
        }
        
        return result
    }
    
    update(data){
        var result;
        var counter = true;
        var values;
        
        for(var key in data.data){
            if(typeof data.data[key] === 'string'){
                data.data[key] = "'" + data.data[key] + "'";
            }
            if(counter){
                values = key + "=" + data.data[key];
                counter = false;
            } else {
                values  = values + ", " + key + "=" + data.data[key];
            }
        }
        
        var sql = "UPDATE " + data.table + " SET " + values + (function(){
                if(typeof data.where !== 'undefined'){
                    var values;
                    var counter = true;
                    for(var key in data.where){
                        if(typeof data.where[key] === 'string'){
                            data.where[key] = "'" + data.where[key] + "'";
                        }
                        if(counter){
                            values = key + "=" + data.where[key];
                            counter = false;
                        } else {
                            values = values + " AND " + key + "=" + data.where[key];
                        }
                    }
                    var s = " WHERE " + values;
                    return s
                } else {return ""}
            })();
        try{
            result = this.con.query(sql);
        } catch(e){
            throw new Error(e);
        }
        
        return result
    }
    delete(data){
        var result;
        if(typeof data.where.value === 'string'){
            data.where.value = "'" + data.where.value + "'"
        }
        var sql = "DELETE FROM " + data.table + (function(){
                if(typeof data.where !== 'undefined'){
                    var values;
                    var counter = true;
                    for(var key in data.where){
                        if(typeof data.where[key] === 'string'){
                            data.where[key] = "'" + data.where[key] + "'";
                        }
                        if(counter){
                            values = key + "=" + data.where[key];
                            counter = false;
                        } else {
                            values = values + " AND " + key + "=" + data.where[key];
                        }
                    }
                    var s = " WHERE " + values;
                    return s
                } else {return ""}
            })();
        try{
            result = this.con.query(sql);
        } catch(e){
            throw new Error(e);
        }
        
        return result
    }
    
    join(data){
        
    }
    
}

module.exports = Queries;