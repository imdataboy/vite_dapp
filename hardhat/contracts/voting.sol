// SPDX-License-Identifier: MIT

pragma solidity ^0.8.2;

contract voting {
    // create a structure template for each of the candidates
    struct Candidate {
        uint256 id;
        string name;
        uint256 number_of_votes;
    }

    // list of all candidates
    Candidate[] public candidates;
    // this will be the owner's address
    address public owner;
    // map all voters' addresses
    mapping(address => bool) public voters;
    // list of voters
    address[] public list_of_voters;

    // create a voting start and end session
    uint256 public voting_start;
    uint256 public voting_end;

    // create an election status
    bool public election_started;

    // restrict creating election to the owner
    modifier onlyOwner() {
        require(msg.sender == owner, "You Are Not AUTHORIZED To start an election");
        _;
    }

    // check if election is ongoing
    modifier election_ongoing() {
        require(election_started, "No election Yet");
        _;
    }

    // create a constructor
    constructor() {
        owner = msg.sender;
    }

    // to start an election
    function start_election(string[] memory _candidates, uint256 _voting_duration) public onlyOwner {
        require(!election_started, "Election is currently ongoing");
        delete candidates;
        reset_all_voters_status();

        for (uint256 i = 0; i < _candidates.length; i++) {
            candidates.push(
                Candidate({id: i, name: _candidates[i], number_of_votes: 0})
            );
        }
        election_started = true;
        voting_start = block.timestamp;
        voting_end = block.timestamp + (_voting_duration * 1 minutes);
    }

    // to add new candidate
    function add_candidate(string memory _name) public onlyOwner election_ongoing {
        require(check_election_period(), "Election Period Has Ended");
        candidates.push(
            Candidate({id: candidates.length, name: _name, number_of_votes: 0})
        );
    }

    // check voter's status
    function voter_status(address _voter) public view election_ongoing returns (bool) {
        return voters[_voter];
    }

    // to vote function
    function vote_to(uint256 _id) public election_ongoing {
        require(check_election_period(), "Election Period Has Ended");
        require(!voters[msg.sender], "You Have Already Voted. You Can Only Vote Once.");
        candidates[_id].number_of_votes++;
        voters[msg.sender] = true;
        list_of_voters.push(msg.sender);
    }

    // get the number of votes
    function retrieve_votes() public view returns (Candidate[] memory) {
        return candidates;
    }

    // monitor the election time
    function election_timer() public view election_ongoing returns (uint256) {
        if (block.timestamp >= voting_end) {
            return 0;
        }
        return (voting_end - block.timestamp);
    }

    // check if election period is still going
    function check_election_period() public returns (bool) {
        if (election_timer() > 0) {
            return true;
        }
        election_started = false;
        return false;
    }

    // reset all voters' status
    function reset_all_voters_status() public onlyOwner {
        for (uint256 i = 0; i < list_of_voters.length; i++) {
            voters[list_of_voters[i]] = false;
        }
        delete list_of_voters;
    }
}