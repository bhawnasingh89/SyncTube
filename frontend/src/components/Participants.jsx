function Participants({
  participants,
  currentUserId,
  isHost,
  onAssignRole,
  onRemove,
}) {
  return (
    <section className="participants-section">
      <div className="panel-header">
        <h2>Participants</h2>

        <span className="participant-count">
          {participants.length}
        </span>
      </div>

      <div className="participants-list">
        {participants.map((participant) => {
          const isCurrentUser =
            participant.userId === currentUserId;

          return (
            <div
              className="participant"
              key={participant.userId}
            >
              <div className="participant-avatar">
                {participant.username
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div className="participant-info">
                <strong>
                  {participant.username}

                  {isCurrentUser && (
                    <span className="you-label">You</span>
                  )}
                </strong>

                <span className="role">
                  {participant.role}
                </span>
              </div>

              {isHost && !isCurrentUser && (
                <div className="participant-actions">
                  <select
                    value={participant.role}
                    onChange={(e) =>
                      onAssignRole(
                        participant.userId,
                        e.target.value
                      )
                    }
                  >
                    <option value="participant">
                      Participant
                    </option>

                    <option value="moderator">
                      Moderator
                    </option>
                  </select>

                  <button
                    className="remove-button"
                    onClick={() =>
                      onRemove(participant.userId)
                    }
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Participants;