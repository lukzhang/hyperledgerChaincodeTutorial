/*
 * SPDX-License-Identifier: Apache-2.0
 */
package org.example;

import org.hyperledger.fabric.contract.Context;
import org.hyperledger.fabric.contract.ContractInterface;
import org.hyperledger.fabric.contract.annotation.Contract;
import org.hyperledger.fabric.contract.annotation.Default;
import org.hyperledger.fabric.contract.annotation.Transaction;
import org.hyperledger.fabric.contract.annotation.Contact;
import org.hyperledger.fabric.contract.annotation.Info;
import org.hyperledger.fabric.contract.annotation.License;
import static java.nio.charset.StandardCharsets.UTF_8;

@Contract(name = "MyAssetInJavaContract",
    info = @Info(title = "MyAssetInJava contract",
                description = "My Smart Contract",
                version = "0.0.1",
                license =
                        @License(name = "Apache-2.0",
                                url = ""),
                                contact =  @Contact(email = "hyperWithJava@example.com",
                                                name = "hyperWithJava",
                                                url = "http://hyperWithJava.me")))
@Default
public class MyAssetInJavaContract implements ContractInterface {
    public  MyAssetInJavaContract() {

    }
    @Transaction()
    public boolean myAssetInJavaExists(Context ctx, String myAssetInJavaId) {
        byte[] buffer = ctx.getStub().getState(myAssetInJavaId);
        return (buffer != null && buffer.length > 0);
    }

    @Transaction()
    public void createMyAssetInJava(Context ctx, String myAssetInJavaId, String value) {
        boolean exists = myAssetInJavaExists(ctx,myAssetInJavaId);
        if (exists) {
            throw new RuntimeException("The asset "+myAssetInJavaId+" already exists");
        }
        MyAssetInJava asset = new MyAssetInJava();
        asset.setValue(value);
        ctx.getStub().putState(myAssetInJavaId, asset.toJSONString().getBytes(UTF_8));
    }

    @Transaction()
    public MyAssetInJava readMyAssetInJava(Context ctx, String myAssetInJavaId) {
        boolean exists = myAssetInJavaExists(ctx,myAssetInJavaId);
        if (!exists) {
            throw new RuntimeException("The asset "+myAssetInJavaId+" does not exist");
        }

        MyAssetInJava newAsset = MyAssetInJava.fromJSONString(new String(ctx.getStub().getState(myAssetInJavaId),UTF_8));
        return newAsset;
    }

    @Transaction()
    public void updateMyAssetInJava(Context ctx, String myAssetInJavaId, String newValue) {
        boolean exists = myAssetInJavaExists(ctx,myAssetInJavaId);
        if (!exists) {
            throw new RuntimeException("The asset "+myAssetInJavaId+" does not exist");
        }
        MyAssetInJava asset = new MyAssetInJava();
        asset.setValue(newValue);

        ctx.getStub().putState(myAssetInJavaId, asset.toJSONString().getBytes(UTF_8));
    }

    @Transaction()
    public void deleteMyAssetInJava(Context ctx, String myAssetInJavaId) {
        boolean exists = myAssetInJavaExists(ctx,myAssetInJavaId);
        if (!exists) {
            throw new RuntimeException("The asset "+myAssetInJavaId+" does not exist");
        }
        ctx.getStub().delState(myAssetInJavaId);
    }

}
