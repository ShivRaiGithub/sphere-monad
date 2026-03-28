// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Sphere {

    // ── Global State ─────────────────────────────────────────────────────────

    address public owner;           // single contract owner
    uint256 public communityCount;  // total communities created

    enum Status { Active, Removed }

    struct Community {
        uint256 id;
        string  name;
        address creator;
        bool    exists;
    }

    struct Member {
        uint256 serial;
        string  name;
        string  intro;
        uint256 joinedAt;
        uint256 lastMessageAt;
        uint256 messageCount;
        Status  status;
    }

    // communityId → Community info
    mapping(uint256 => Community) public communities;

    // communityId → member wallet → Member record
    mapping(uint256 => mapping(address => Member)) public members;

    // communityId → ordered list of member wallets (for range queries)
    mapping(uint256 => address[]) public memberList;

    // ── Events ───────────────────────────────────────────────────────────────

    event CommunityCreated(uint256 indexed communityId, string name, address indexed creator);
    event MemberRegistered(uint256 indexed communityId, address indexed member, uint256 serial, string name, uint256 joinedAt);
    event MemberRemoved(uint256 indexed communityId, address indexed member, uint256 serial);
    event MessageSent(uint256 indexed communityId, address indexed member, string message, uint256 timestamp);

    // ── Modifiers ────────────────────────────────────────────────────────────

    modifier onlyOwner() {
        require(msg.sender == owner, "Only contract owner");
        _;
    }

    modifier communityExists(uint256 _communityId) {
        require(communities[_communityId].exists, "Community does not exist");
        _;
    }

    modifier onlyCreator(uint256 _communityId) {
        require(msg.sender == communities[_communityId].creator, "Only community creator");
        _;
    }

    modifier onlyActiveMember(uint256 _communityId) {
        require(members[_communityId][msg.sender].joinedAt != 0, "Not a member");
        require(members[_communityId][msg.sender].status == Status.Active, "Member is removed");
        _;
    }

    // ── Constructor ──────────────────────────────────────────────────────────

    constructor() {
        owner = msg.sender;
    }

    // ── Owner Functions ───────────────────────────────────────────────────────

    /// @notice Contract owner creates a new community, assigning a creator address.
    function createCommunity(string calldata _name, address _creator) external onlyOwner {
        require(_creator != address(0), "Invalid creator address");

        uint256 id = ++communityCount;  // 1-based community ID

        communities[id] = Community({
            id:      id,
            name:    _name,
            creator: _creator,
            exists:  true
        });

        emit CommunityCreated(id, _name, _creator);
    }

    // ── Creator Functions ─────────────────────────────────────────────────────

    /// @notice Community creator removes a member.
    function removeMember(uint256 _communityId, address _member)
        external
        communityExists(_communityId)
        onlyCreator(_communityId)
    {
        require(members[_communityId][_member].joinedAt != 0, "Not a member");
        require(members[_communityId][_member].status == Status.Active, "Already removed");

        members[_communityId][_member].status = Status.Removed;
        emit MemberRemoved(_communityId, _member, members[_communityId][_member].serial);
    }

    // ── Member Functions ──────────────────────────────────────────────────────

    /// @notice Join a community. Assigns the next serial number and Active status.
    function register(uint256 _communityId, string calldata _name, string calldata _intro)
        external
        communityExists(_communityId)
    {
        require(members[_communityId][msg.sender].joinedAt == 0, "Already registered");

        uint256 serial = memberList[_communityId].length + 1;  // 1-based serial

        members[_communityId][msg.sender] = Member({
            serial:        serial,
            name:          _name,
            intro:         _intro,
            joinedAt:      block.timestamp,
            lastMessageAt: 0,
            messageCount:  0,
            status:        Status.Active
        });

        memberList[_communityId].push(msg.sender);
        emit MemberRegistered(_communityId, msg.sender, serial, _name, block.timestamp);
    }

    /// @notice Post a message in a community — active members only, once every 12 hours.
    function sendMessage(uint256 _communityId, string calldata _message)
        external
        communityExists(_communityId)
        onlyActiveMember(_communityId)
    {
        require(
            block.timestamp >= members[_communityId][msg.sender].lastMessageAt + 12 hours,
            "Wait 12 hours between messages"
        );

        members[_communityId][msg.sender].lastMessageAt = block.timestamp;
        members[_communityId][msg.sender].messageCount += 1;
        emit MessageSent(_communityId, msg.sender, _message, block.timestamp);
    }

    // ── View Functions ────────────────────────────────────────────────────────

    /// @notice Total registered members in a community (including removed).
    function memberCount(uint256 _communityId)
        external
        view
        communityExists(_communityId)
        returns (uint256)
    {
        return memberList[_communityId].length;
    }

    /// @notice Fetch member details for a 0-based index range [from, to).
    ///         e.g. getMembersInRange(1, 0, 10) fetches the first 10 members of community 1.
    function getMembersInRange(uint256 _communityId, uint256 from, uint256 to)
        external
        view
        communityExists(_communityId)
        returns (
            address[] memory wallets,
            uint256[] memory serials,
            string[]  memory names,
            string[]  memory intros,
            uint256[] memory joinedAts,
            uint256[] memory lastMessageAts,
            uint256[] memory messageCounts,
            Status[]  memory statuses
        )
    {
        uint256 totalMembers = memberList[_communityId].length;
        require(from < to,         "from must be less than to");
        require(to <= totalMembers, "to exceeds member count");

        uint256 size = to - from;
        wallets        = new address[](size);
        serials        = new uint256[](size);
        names          = new string[](size);
        intros         = new string[](size);
        joinedAts      = new uint256[](size);
        lastMessageAts = new uint256[](size);
        messageCounts  = new uint256[](size);
        statuses       = new Status[](size);

        for (uint256 i = 0; i < size; i++) {
            wallets[i] = memberList[_communityId][from + i];
            serials[i] = members[_communityId][wallets[i]].serial;
            names[i] = members[_communityId][wallets[i]].name;
            intros[i] = members[_communityId][wallets[i]].intro;
            joinedAts[i] = members[_communityId][wallets[i]].joinedAt;
            lastMessageAts[i] = members[_communityId][wallets[i]].lastMessageAt;
            messageCounts[i] = members[_communityId][wallets[i]].messageCount;
            statuses[i] = members[_communityId][wallets[i]].status;
        }
    }
}
