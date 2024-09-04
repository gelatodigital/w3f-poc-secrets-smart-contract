// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/interfaces/IERC1271.sol";
import "./GelatoAutomate/AutomateTaskCreator.sol";

//solhint-disable no-empty-blocks
//solhint-disable not-rely-on-time

contract GelatoSecretsContract is AutomateTaskCreator, ERC165, IERC1271 {

    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    uint256 public count;
    uint256 public lastExecuted;
    bytes32 public taskId;
    uint256 public constant MAX_COUNT = 5;
    uint256 public constant INTERVAL = 20 * 60 * 1000; // 20 minutes in milliseconds

    address public trustedSigner;

    event CounterTaskCreated(bytes32 taskId);

    constructor(address _automate, address _trustedSigner) AutomateTaskCreator(_automate) {
        trustedSigner = _trustedSigner;
    }

    function createTask(
        string memory _web3FunctionHash,
        bytes calldata _web3FunctionArgsHex
    ) external {
        require(taskId == bytes32(""), "Already started task");

        bytes memory execData = abi.encodeCall(this.increaseCount, (1));

        ModuleData memory moduleData = ModuleData({
            modules: new Module[](3),
            args: new bytes[](3)
        });
        moduleData.modules[0] = Module.PROXY;
        moduleData.modules[1] = Module.WEB3_FUNCTION;
        moduleData.modules[2] = Module.TRIGGER;

        moduleData.args[0] = _proxyModuleArg();
        moduleData.args[1] = _web3FunctionModuleArg(
            _web3FunctionHash,
            _web3FunctionArgsHex
        );

        moduleData.args[2] = _timeTriggerModuleArg(
            uint128(block.timestamp + INTERVAL),
            uint128(INTERVAL)
        );

        bytes32 id = _createTask(
            address(this),
            execData,
            moduleData,
            address(0)
        );

        taskId = id;
        emit CounterTaskCreated(id);
    }

    function cancelTask() external {
        require(taskId != bytes32(""), "Task not started");
        _cancelTask(taskId);
    }

    function increaseCount(uint256 _amount) external onlyDedicatedMsgSender {
        uint256 newCount = count + _amount;

        if (newCount >= MAX_COUNT) {
            _cancelTask(taskId);
            count = 0;
        } else {
            count += _amount;
            lastExecuted = block.timestamp;
        }
    }

    function depositFunds(uint256 _amount, address _token) external payable {
        _depositFunds1Balance(_amount, _token, address(this));
    }

    // EIP-1271 implementation
    function isValidSignature(bytes32 hash, bytes memory signature) external view override returns (bytes4) {
        // Remove the toEthSignedMessageHash call
        address recoveredSigner = ECDSA.recover(hash, signature);
        // Check if the recovered signer matches the trusted signer
        if (recoveredSigner == trustedSigner) {
            return this.isValidSignature.selector; // Return the magic value 0x1626ba7e
        } else {
            return 0xffffffff; // Return invalid signature value
        }
    }

    // Override supportsInterface to support ERC165
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165) returns (bool) {
        return
            interfaceId == type(IERC1271).interfaceId ||
            super.supportsInterface(interfaceId);
    }
}