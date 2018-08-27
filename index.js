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
                    keys = data.keys[i];
                    counter = false
                } else {
                    keys = keys + ", " + data.keys[i];
                }
            }            
            var sql = "SELECT (" + keys + ") FROM " + data.table + (function(){
                if(typeof data.where !== 'undefined'){
                    if(typeof data.where.value === 'string'){
                        data.where.value = "'" + data.where.value + "'";
                    }
                    var s = " WHERE " + data.where.cond + "=" + data.where.value;
                    return s
                } else {return ""}
            })()
            try{
                result = this.con.query(sql);
            } catch(e) {
                throw new Error(e);
            }
            
            return result
            
        } else {
            var sql = "SELECT * FROM " + data.table + (function(){
                if(typeof data.where !== 'undefined'){
                    if(typeof data.where.value === 'string'){
                        data.where.value = "'" + data.where.value + "'";
                    }
                    var s = " WHERE " + data.where.cond + "=" + data.where.value;
                    return s;
                } else {return ""}
            })()
            try{
                result = this.con.query(sql);
            } catch(e) {
                throw new Error(e);
            }
            
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
                    if(typeof data.where.value === 'string'){
                        data.where.value = "'" + data.where.value + "'";
                    }
                    var s = " WHERE " + data.where.cond + "=" + data.where.value;
                    return s
                } else {return ""}
            })()
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
        var sql = "DELETE FROM " + data.table + "WHERE " + data.where.cond + "=" + data.where.value;
        try{
            result = this.con.query(sql);
        } catch(e){
            throw new Error(e);
        }
        
        return result
    }
    
}

module.exports = Queries;