package main

import (
	"fmt"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	"github.com/hyperledger/fabric/protos/peer"
)

// SimpleAsset implements a simple chaincode to manage an asset
type SimpleAsset struct {
}

// Init is called during chaincode instantiation to initialize any data.
func (t *SimpleAsset) Init(stub shim.ChaincodeStubInterface) peer.Response {
	//Get args from tx proposal
	args := stub.GetStringArgs()
	if len(args) != 2 {
		return shim.Error("inccorect args. expecting key and value")
	}

	//set up any vars or assets by calling stub.PutState()

	//Store key and val on ledger
	err := stub.PutState(args[0], []byte(args[1]))
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to create asset: %s", args[0]))
	}
	return shim.Success(nil)
}

//Invoke called per tx on chaincode. Each tx is 'get' or 'set'. 'set' may
//create new asset by specifying new keyvalue pair
func (t *SimpleAsset) Invoke(stub shim.ChaincodeStubInterface) peer.Response {
	//excrat f'n and args from tx proposal
	fn, args := stub.GetFunctionAndParameters()

	var result string
	var err error
	if fn == "set" {
		result, err = set(stub, args)
	} else {
		result, err = get(stub, args)
	}
	if err != nil {
		return shim.Error(err.Error())
	}

	//REturn result as success payload
	return shim.Success([]byte(result))
}

//Set stores the asset with both key and val on ledger. If key exists, it'll
//override val with new val
func set(stub shim.ChaincodeStubInterface, args []string) (string, error) {
	if len(args) != 2 {
		return "", fmt.Errorf("inccorect args. expecting key and val")
	}

	err := stub.PutState(args[0], []byte(args[1]))
	if err != nil {
		return "", fmt.Errorf("failed to set asset: %s", args[0])
	}
	return args[1], nil
}

//Get returns val of specified asset key
func get(stub shim.ChaincodeStubInterface, args []string) (string, error) {
	if len(args) != 1 {
		return "", fmt.Errorf("Inccorect args. expecting key")
	}

	value, err := stub.GetState(args[0])
	if err != nil {
		return "", fmt.Errorf("failed to get assets: %s wtih err: %s", args[0], err)
	}
	if value == nil {
		return "", fmt.Errorf("asset not found; %s", args[0])
	}
	return string(value), nil
}

//main f'n starts up chaincode in container during instantiate
func main() {
	if err := shim.Start(new(SimpleAsset)); err != nil {
		fmt.Printf("error starting simpleasset chaincode: %s", err)
	}
}
