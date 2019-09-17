/*
 * SPDX-License-Identifier: Apache-2.0
 */

package org.example;

import java.util.ArrayList;

import org.hyperledger.fabric.contract.annotation.DataType;
import org.hyperledger.fabric.contract.annotation.Property;
import org.json.JSONObject;

import main.java.org.example.LukesAsset;

@DataType()
public class MyAsset {

    @Property()
    private String value;
    private String[] owners;
    private ArrayList<Integer> ownerIDs;

    public MyAsset(){
        ownerIDs=new ArrayList<Integer>();
    }

    //******Luke's added stuff */    
    public String helloWorld(){
        return "Hello World";
    }

    public void setOwnership(){

    }

    public String getOwnerOf(int index){
        return owners[index];
    }

    public void addID(int id){
        if(!ownerIDs.contains(id)){
            ownerIDs.add(id);
        }
    }

    //************************ */

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String toJSONString() {
        return new JSONObject(this).toString();
    }

    public static MyAsset fromJSONString(String json) {
        String value = new JSONObject(json).getString("value");
        MyAsset asset = new MyAsset();
        asset.setValue(value);
        return asset;
    }
}
