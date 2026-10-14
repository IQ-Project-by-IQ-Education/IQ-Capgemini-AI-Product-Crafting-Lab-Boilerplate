"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

const blankSkill = { name: "", level: "Intermediate" };
const blankProject = { name: "", description: "" };
const blankExpert = {
  name: "",
  email: "",
  skills: [{ ...blankSkill }],
  projects: [{ ...blankProject }],
};

function normalize(text) {
  return text.trim().toLowerCase();
}

function scoreExpert(expert, term) {
  const search = normalize(term);

  if (!search) {
    return 1;
  }

  let score = 0;
  expert.skills.forEach((skill) => {
    const skillName = normalize(skill.name);
    if (skillName === search) score += 120 + Number(skill.levelScore || 0) * 10;
    if (skillName.includes(search)) score += 70 + Number(skill.levelScore || 0) * 10;
  });

  expert.projects.forEach((project) => {
    const text = normalize(`${project.name} ${project.description}`);
    if (text.includes(search)) score += 35;
  });

  if (normalize(expert.name).includes(search)) score += 20;

  return score;
}

function matchingSkills(expert, term) {
  const search = normalize(term);
  const matches = expert.skills.filter((skill) => normalize(skill.name).includes(search));
  return matches.length ? matches : expert.skills.slice(0, 3);
}

function ExpertForm({ expert, mode, onCancel, onSave }) {
  const [draft, setDraft] = useState(expert);
  const [message, setMessage] = useState("");

  function updateField(field, value) {
    setDraft((current) => ({ ...current, [field]: value }));
    setMessage("");
  }

  function updateListItem(listName, index, field, value) {
    setDraft((current) => ({
      ...current,
      [listName]: current[listName].map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      ),
    }));
    setMessage("");
  }

  function addListItem(listName, item) {
    setDraft((current) => ({ ...current, [listName]: [...current[listName], item] }));
  }

  function removeListItem(listName, index, fallback) {
    setDraft((current) => {
      const nextItems = current[listName].filter((item, itemIndex) => itemIndex !== index);
      return { ...current, [listName]: nextItems.length ? nextItems : [fallback] };
    });
  }

  function saveExpert() {
    const cleanExpert = {
      ...draft,
      name: draft.name.trim(),
      email: draft.email.trim(),
      skills: draft.skills
        .map((skill) => ({ name: skill.name.trim(), level: skill.level }))
        .filter((skill) => skill.name),
      projects: draft.projects
        .map((project) => ({
          name: project.name.trim(),
          description: project.description.trim(),
        }))
        .filter((project) => project.name || project.description),
    };

    if (!cleanExpert.name || !cleanExpert.email || cleanExpert.skills.length === 0) {
      setMessage("Add a name, email, and at least one skill.");
      return;
    }

    onSave(cleanExpert);
  }

  return (
    <section className="workspace">
      <div className="sectionHeading">
        <p className="eyebrow">{mode === "add" ? "Add expert" : "Edit expert"}</p>
        <h2>{mode === "add" ? "Create a new expert profile" : `Update ${expert.name}`}</h2>
      </div>

      <div className="formGrid">
        <label className="field">
          <span>Name</span>
          <input value={draft.name} onChange={(event) => updateField("name", event.target.value)} />
        </label>
        <label className="field">
          <span>Email</span>
          <input value={draft.email} onChange={(event) => updateField("email", event.target.value)} />
        </label>
      </div>

      <div className="formSection">
        <div className="rowTitle">
          <h3>Skills</h3>
          <button type="button" onClick={() => addListItem("skills", { ...blankSkill })}>
            Add Skill
          </button>
        </div>
        <div className="stack">
          {draft.skills.map((skill, index) => (
            <div className="editRow" key={`skill-${index}`}>
              <input
                aria-label="Skill name"
                placeholder="Skill"
                value={skill.name}
                onChange={(event) => updateListItem("skills", index, "name", event.target.value)}
              />
              <select
                aria-label="Skill level"
                value={skill.level}
                onChange={(event) => updateListItem("skills", index, "level", event.target.value)}
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
                <option>Expert</option>
              </select>
              <button type="button" onClick={() => removeListItem("skills", index, { ...blankSkill })}>
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="formSection">
        <div className="rowTitle">
          <h3>Projects</h3>
          <button type="button" onClick={() => addListItem("projects", { ...blankProject })}>
            Add Project
          </button>
        </div>
        <div className="stack">
          {draft.projects.map((project, index) => (
            <div className="projectEdit" key={`project-${index}`}>
              <input
                aria-label="Project name"
                placeholder="Project name"
                value={project.name}
                onChange={(event) => updateListItem("projects", index, "name", event.target.value)}
              />
              <textarea
                aria-label="Project description"
                placeholder="Project description"
                value={project.description}
                onChange={(event) => updateListItem("projects", index, "description", event.target.value)}
              />
              <button type="button" onClick={() => removeListItem("projects", index, { ...blankProject })}>
                Remove Project
              </button>
            </div>
          ))}
        </div>
      </div>

      {message ? <p className="notice warning">{message}</p> : null}

      <div className="actions">
        <button className="primary" type="button" onClick={saveExpert}>
          Save Expert
        </button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </section>
  );
}

function Profile({ expert, fromManage, onBack, onEdit }) {
  return (
    <section className="workspace">
      <button className="quietBack" type="button" onClick={onBack}>
        Back
      </button>
      <div className="profileHeader">
        <div>
          <p className="eyebrow">Expert profile</p>
          <h2>{expert.name}</h2>
          <a href={`mailto:${expert.email}`}>{expert.email}</a>
        </div>
        {fromManage ? (
          <button className="primary" type="button" onClick={() => onEdit(expert)}>
            Edit
          </button>
        ) : null}
      </div>

      <div className="detailGrid">
        <section>
          <h3>Skills</h3>
          <div className="skillList">
            {expert.skills.map((skill) => (
              <span className="skillPill" key={`${expert.id}-${skill.name}`}>
                {skill.name} <strong>{skill.level}</strong>
              </span>
            ))}
          </div>
        </section>

        <section>
          <h3>Projects</h3>
          <div className="projectList">
            {expert.projects.map((project) => (
              <article className="projectCard" key={`${expert.id}-${project.name}`}>
                <h4>{project.name}</h4>
                <p>{project.description}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}

function ProposalChat({ onBack }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Tell me the company SIRET, address, timeline, price, references, and anything else the proposal should cover.",
    },
  ]);
  const [input, setInput] = useState("");
  const [proposal, setProposal] = useState(null);
  const [isWorking, setIsWorking] = useState(false);
  const [notice, setNotice] = useState("");

  async function sendMessage(event) {
    event.preventDefault();
    const text = input.trim();

    if (!text) {
      return;
    }

    setInput("");
    setNotice("");
    setIsWorking(true);
    setMessages((current) => [...current, { role: "user", text }]);

    const response = await fetch("/api/proposal-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
    });
    const result = await response.json();

    setMessages((current) => [
      ...current,
      { role: "assistant", text: result.reply || "I created a proposal draft." },
    ]);

    if (result.proposal) {
      setProposal(result.proposal);
    }

    setIsWorking(false);
  }

  async function saveProposal() {
    if (!proposal) {
      return;
    }

    await fetch("/api/proposals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(proposal),
    });

    setNotice("Saved - it will still be here next time.");
  }

  return (
    <section className="workspace proposalWorkspace">
      <button className="quietBack" type="button" onClick={onBack}>
        Back
      </button>
      <div className="sectionHeading">
        <div>
          <p className="eyebrow">Proposal assistant</p>
          <h2>Create proposals by chat</h2>
        </div>
      </div>

      <div className="chatLayout">
        <div className="chatPanel">
          <div className="messageList">
            {messages.map((message, index) => (
              <p className={`chatMessage ${message.role}`} key={`${message.role}-${index}`}>
                {message.text}
              </p>
            ))}
            {isWorking ? <p className="chatMessage assistant">Drafting your proposal...</p> : null}
          </div>
          <form className="chatComposer" onSubmit={sendMessage}>
            <textarea
              aria-label="Proposal request"
              placeholder="Example: Create a proposal for SIRET 12345678900010, office in Paris, 8 week timeline, price 80,000 EUR, references in retail cloud migration."
              value={input}
              onChange={(event) => setInput(event.target.value)}
            />
            <button className="primary" type="submit" disabled={isWorking}>
              Create Proposal
            </button>
          </form>
        </div>

        <aside className="proposalPreview">
          <div className="previewHeader">
            <p className="eyebrow">Draft</p>
            {proposal ? (
              <button type="button" onClick={saveProposal}>
                Save Proposal
              </button>
            ) : null}
          </div>
          {proposal ? (
            <>
              <div className="proposalFacts">
                <span>SIRET: {proposal.siret}</span>
                <span>Timeline: {proposal.timeline}</span>
                <span>Price: {proposal.price}</span>
              </div>
              <article className="proposalText">
                {proposal.content.split("\n").map((line, index) =>
                  line ? <p key={`${line}-${index}`}>{line}</p> : <br key={index} />
                )}
              </article>
              {notice ? <p className="notice">{notice}</p> : null}
            </>
          ) : (
            <p className="emptyState">Your generated proposal will appear here.</p>
          )}
        </aside>
      </div>
    </section>
  );
}

export default function Home() {
  const [experts, setExperts] = useState([]);
  const [query, setQuery] = useState("");
  const [searchedTerm, setSearchedTerm] = useState("");
  const [view, setView] = useState("search");
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [editingExpert, setEditingExpert] = useState(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    loadExperts();
  }, []);

  async function loadExperts() {
    const response = await fetch("/api/experts");
    const rows = await response.json();
    setExperts(rows);
  }

  const rankedExperts = useMemo(() => {
    const term = searchedTerm || query;
    return experts
      .map((expert) => ({ ...expert, score: scoreExpert(expert, term) }))
      .filter((expert) => !term.trim() || expert.score > 0)
      .sort((first, second) => second.score - first.score || first.name.localeCompare(second.name));
  }, [experts, query, searchedTerm]);

  function runSearch(event) {
    event.preventDefault();
    setSearchedTerm(query.trim());
    setView("search");
    setNotice("");
  }

  function openProfile(expert, source = "search") {
    setSelectedExpert({ ...expert, source });
    setView("profile");
    setNotice("");
  }

  function openManage() {
    setView("manage");
    setSelectedExpert(null);
    setEditingExpert(null);
    setNotice("");
  }

  function startAdd() {
    setEditingExpert({ ...blankExpert, skills: [{ ...blankSkill }], projects: [{ ...blankProject }] });
    setView("form");
    setNotice("");
  }

  function startEdit(expert) {
    setEditingExpert({
      ...expert,
      skills: expert.skills.length ? expert.skills : [{ ...blankSkill }],
      projects: expert.projects.length ? expert.projects : [{ ...blankProject }],
    });
    setView("form");
    setNotice("");
  }

  async function saveExpert(expert) {
    const isEdit = Boolean(editingExpert?.id);
    const response = await fetch(isEdit ? `/api/experts/${editingExpert.id}` : "/api/experts", {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(expert),
    });
    const saved = await response.json();

    await loadExperts();
    setNotice("Saved - it will still be here next time.");
    setEditingExpert(null);
    setSelectedExpert({ ...saved, source: "manage" });
    setView("profile");
  }

  function profileBack() {
    if (selectedExpert?.source === "manage") {
      openManage();
    } else {
      setView("search");
    }
  }

  return (
    <main className="shell">
      <header className="topbar">
        <button className="brand" type="button" onClick={() => setView("search")}>
          <Image src="/capgemini-logo.png" alt="Capgemini" width={136} height={39} priority />
          <span>TeoExpert</span>
        </button>
        <nav>
          <button type="button" onClick={() => setView("search")}>
            Search
          </button>
          <button type="button" onClick={openManage}>
            Manage Experts
          </button>
          <button type="button" onClick={() => setView("proposalChat")}>
            Proposal Chat
          </button>
        </nav>
      </header>

      {view === "search" ? (
        <>
          <section className="hero">
            <div>
              <p className="eyebrow">Internal expertise finder</p>
              <h1>TeoExpert</h1>
              <p className="lead">Find the right expert inside the company, fast.</p>
              <form className="searchBar" onSubmit={runSearch}>
                <input
                  aria-label="Search by skill"
                  placeholder="Search by skill, technology, domain, or expertise"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
                <button className="primary" type="submit">
                  Search
                </button>
              </form>
              <div className="actions">
                <button type="button" onClick={openManage}>
                  Manage Experts
                </button>
                <button type="button" onClick={() => setView("proposalChat")}>
                  Create Proposal
                </button>
              </div>
            </div>
            <aside className="quickStats">
              <span>{experts.length}</span>
              <p>experts saved</p>
            </aside>
          </section>

          <section className="results">
            <div className="sectionHeading">
              <p className="eyebrow">Ranked results</p>
              <h2>{searchedTerm ? `Best matches for "${searchedTerm}"` : "Start with the full expert list"}</h2>
            </div>

            {rankedExperts.length ? (
              <div className="cardGrid">
                {rankedExperts.map((expert) => (
                  <article className="expertCard" key={expert.id} onClick={() => openProfile(expert)}>
                    <div className="cardTop">
                      <div>
                        <h3>{expert.name}</h3>
                        <p>{expert.email}</p>
                      </div>
                      <span className="rankScore">Match {expert.score}</span>
                    </div>
                    <div className="skillList">
                      {matchingSkills(expert, searchedTerm || query).map((skill) => (
                        <span className="skillPill" key={`${expert.id}-${skill.name}`}>
                          {skill.name} <strong>{skill.level}</strong>
                        </span>
                      ))}
                    </div>
                    <p className="projectSummary">
                      {expert.projects.slice(0, 2).map((project) => project.name).join(" | ") || "No project listed yet"}
                    </p>
                    <button type="button" onClick={() => openProfile(expert)}>
                      View Profile
                    </button>
                  </article>
                ))}
              </div>
            ) : (
              <div className="emptyState">
                <p>No matching experts found.</p>
                <button className="primary" type="button" onClick={startAdd}>
                  Add Expert
                </button>
              </div>
            )}
          </section>
        </>
      ) : null}

      {view === "manage" ? (
        <section className="workspace">
          <div className="manageHeader">
            <div>
              <p className="eyebrow">Manage experts</p>
              <h2>Expert Directory</h2>
              <p>Add, edit, and review experts stored in this app.</p>
            </div>
            <button className="primary" type="button" onClick={startAdd}>
              Add Expert
            </button>
          </div>

          {notice ? <p className="notice">{notice}</p> : null}

          <div className="directory">
            {experts.map((expert) => (
              <article className="directoryRow" key={expert.id}>
                <div>
                  <h3>{expert.name}</h3>
                  <p>{expert.email}</p>
                </div>
                <p>{expert.skills.slice(0, 3).map((skill) => skill.name).join(", ")}</p>
                <span>{expert.projects.length} projects</span>
                <div className="rowActions">
                  <button type="button" onClick={() => openProfile(expert, "manage")}>
                    View Profile
                  </button>
                  <button type="button" onClick={() => startEdit(expert)}>
                    Edit
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="actions">
            <button type="button" onClick={() => setView("search")}>
              Back to Search
            </button>
          </div>
        </section>
      ) : null}

      {view === "profile" && selectedExpert ? (
        <Profile
          expert={selectedExpert}
          fromManage={selectedExpert.source === "manage"}
          onBack={profileBack}
          onEdit={startEdit}
        />
      ) : null}

      {view === "form" && editingExpert ? (
        <ExpertForm
          expert={editingExpert}
          mode={editingExpert.id ? "edit" : "add"}
          onCancel={openManage}
          onSave={saveExpert}
        />
      ) : null}

      {view === "proposalChat" ? <ProposalChat onBack={() => setView("search")} /> : null}
    </main>
  );
}
