/*
 * SPDX-License-Identifier: Apache-2.0
 */

package main.java.org.example;

import java.util.ArrayList;

import org.hyperledger.fabric.contract.annotation.DataType;
import org.hyperledger.fabric.contract.annotation.Property;
import org.json.JSONObject;

@DataType()
public class LukesAsset {

    private String msg;
    private int age;

    public LukesAsset(String _msg, int _age){
        _msg = msg;
        _age = age;
    }

    public String getMsg(){
        return msg;
    }

    // public void CreateInstance(String _msg, int _age){
    //     return new FutureAsset(_msg, _age);
    // }

}
