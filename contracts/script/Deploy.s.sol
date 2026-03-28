// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script} from "forge-std/Script.sol";
import {Sphere} from "../src/Sphere.sol";

contract SphereScript is Script {
    Sphere public sphere;

    function setUp() public {}

    function run() public {
        vm.startBroadcast(msg.sender);

        sphere = new Sphere();
        sphere.createCommunity("Monad Blitz", msg.sender);

        vm.stopBroadcast();
    }
}
