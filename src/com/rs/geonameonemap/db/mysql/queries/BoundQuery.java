package com.rs.geonameonemap.db.mysql.queries;

import com.rs.geonameonemap.db.DbUse;
import com.rs.geonameonemap.db.mysql.connections.*;
import com.rs.geonameonemap.json.BoundJson;
import com.rs.geonameonemap.json.ObjectJson;

import java.sql.*;
import java.util.*;

/**
 * Created by Administrator on 2017/7/28 0028.
 */
public class BoundQuery extends MySQLQuery {

//    public static final String tbName = "enshidivid";
    public static final String tbName = "zgbounds";
    public static final String tmpTbName = "enshidivid_temp";
    public static final String[] boundPathColumns = new String[] {
            "OBJECTID", "Id", "path", "Name", "AdminGrade", "Grade", "LeftName", "RightName"
    };


    public static String getEasyBoundsInfo() {
        BoundJson.consColumnNames(dbType, tbName);
        String sql = "SELECT * from " + tbName;
        ResultSet rs = MysqlLocalConnection.executeQuery(sql);
        String str = getBoundsInfoFromResultSet(rs);
        return str;
    }

    public static String getEasyTempBoundsInfo() {
        BoundJson.consColumnNames(dbType, tmpTbName);
        String sql = "SELECT * from " + tmpTbName;
        ResultSet rs = MysqlLocalConnection.executeQuery(sql);
        String str = getBoundsInfoFromResultSet(rs);
        return str;
    }

    public static String getBoundPathsInfo() {
        BoundJson.consColumnNames(dbType, tbName);
        String sql = "SELECT "+ DbUse.columnsToSQL(boundPathColumns) +" from " + tbName;
        ResultSet rs = MysqlLocalConnection.executeQuery(sql);
        String str = getBoundsInfoFromResultSet(rs);
        return str;
    }

    public static String getRandomResults(boolean admin) {
        String sql = null;
        if(admin) {
            BoundJson.consColumnNames(dbType, tmpTbName);
            sql = "SELECT * from " + tmpTbName;
        } else {
            BoundJson.consColumnNames(dbType, tbName);
            sql = "SELECT * from " + tbName;
        }
        ResultSet rs = MysqlLocalConnection.executeQuery(sql);
        BoundJson[] bs = searchBoundsInfoFromResultSet(rs);
        int len = bs.length;
        if(len < 1) {
            return "{}";
        }
        int[] randomIds = DbUse.createRandomIds(len);
        if(randomIds.length <1) {
            return "{}";
        }
        BoundJson[] re = new BoundJson[randomIds.length];
        for(int i = 0; i < randomIds.length; i++) {
            re[i] = bs[i];
        }
        String str = BoundJson.toJson(re);
        return str;
    }


    public static String getBoundInfoByNum(String attr, String val) {
        BoundJson bj = searchBoundInfoByNum(attr, val);
        if(bj != null) {
            return bj.toJson();
        } else {
            return null;
        }
    }

    protected static BoundJson[] searchBoundsInfoFromResultSet(ResultSet rs) {
        int num = DbUse.getResultSetRowNum(rs);
        if(num < 1) {
            return null;
        }
        BoundJson[] bs = new BoundJson[num];
        try {
            int i = 0;
            do {
                BoundJson dj = new BoundJson(rs);
                bs[i] = dj;
                i++;
            } while (rs.next());
            rs.close();
        } catch (SQLException se) {
            se.printStackTrace();
        }
        return bs;
    }

    protected static String getBoundsInfoFromResultSet(ResultSet rs) {
        BoundJson[] bs = searchBoundsInfoFromResultSet(rs);
        if(bs == null || bs.length < 1) {
            return "";
        }
        String str = ObjectJson.toJson(bs);
        return str;
    }


    public static BoundJson searchBoundInfoByNum(String attr, String val) {
        BoundJson.consColumnNames(dbType, tbName);
        String sql = "SELECT * from " + tbName +" where " + attr +" = " + val;
        ResultSet rs = MysqlLocalConnection.executeQuery(sql);
        BoundJson bj = null;
        try {
            if (rs.next()) {
                bj = new BoundJson(rs);
            }
        } catch (SQLException se) {
            se.printStackTrace();
        } finally {
            return bj;
        }
    }

}
