import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles.css";

export default () => {
  const [projectId, setprojectId] = useState(null);
  const [projectName, setProjectName] = useState("");
  const [bugId, setbugId] = useState(null);
  const [bugTitle, setBugTitle] = useState("");
  const [bugProjectid, setbugProjectid] = useState(null);
  const [projectList, setprojectList] = useState([]);
  const [bugList, setbugtList] = useState([]);

  useEffect(() => {
    getProjects();
  }, []);

  const getProjects = async () => {
    const { data } = await axios("http://localhost:8080/api/project/");
    setprojectList(data);
  };

  const saveProject = async () => {
    if (projectId) {
      await axios.put("http://localhost:8080/api/project/", {
        id: projectId,
        name: projectName,
      });
    } else {
      await axios.post("http://localhost:8080/api/project/", {
        name: projectName,
      });
    }

    setprojectId(null);
    setProjectName("");

    getProjects();
  };

  const edit = async (item) => {
    setprojectId(item.id);
    setProjectName(item.name);
  };

  const deleteProject = async (id) => {
    await axios.delete(`http://localhost:8080/api/project/${id}`);
    getProjects();
  };

  const addBug = async (project) => {
    const { data } = await axios(`http://localhost:8080/api/bug/${project.id}`);
    setbugProjectid(project.id);
    setbugtList(data);
  };

  const saveBug = async () => {
    await axios.post(`http://localhost:8080/api/bug/${bugProjectid}`, {
      title: bugTitle,
    });

    const { data } = await axios(
      `http://localhost:8080/api/bug/${bugProjectid}`
    );
    setBugTitle("");
    setbugProjectid(bugProjectid);
    setbugtList(data);
  };

  const deleteBug = async (id) => {
    await axios.delete(`http://localhost:8080/api/bug/${id}`);
    const { data } = await axios(
      `http://localhost:8080/api/bug/${bugProjectid}`
    );

    setbugtList(data);
  };

  return (
    <div>
      <div className="container">
        <div className="header">Invillia BugTracker</div>
        <div className="form">
          <div className="title">Project</div>
          <input type="hidden" value={projectId}></input>
          <input
            id="projectName"
            type="text"
            value={projectName}
            onChange={(e) => {
              setProjectName(e.target.value);
            }}
            placeholder="Project Name"
          ></input>
          <input
            className="save-btn"
            value="Salvar"
            type="submit"
            onClick={saveProject}
          ></input>
        </div>
        <div className="body">
          <div className="list-projects">
            <div>
              {projectList.map((item, key) => (
                <div className="project-list-row">
                  <div>
                    <input type="hidden" value={item.id}></input>
                    {item.name}
                  </div>
                  <div>
                    <input
                      className="add"
                      value="Add Bug"
                      type="submit"
                      onClick={() => {
                        addBug(item);
                      }}
                    ></input>
                    <input
                      value="Editar"
                      type="submit"
                      onClick={() => {
                        edit(item);
                      }}
                    ></input>
                    <input
                      className="delete"
                      value="Excluir"
                      type="submit"
                      onClick={() => {
                        deleteProject(item.id);
                      }}
                    ></input>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="list-bugs">
            <div>
              <div className="bugs-controles">
                <input
                  id="bugTitle"
                  type="text"
                  value={bugTitle}
                  onChange={(e) => {
                    setBugTitle(e.target.value);
                  }}
                  placeholder="Bug Title"
                ></input>
                <input value="Add Bug" type="submit" onClick={saveBug}></input>
              </div>

              {bugList.map((item, key) => (
                <div className="bug-list-row">
                  <div>{item.title}</div>
                  <input
                    className="delete"
                    value="Excluir"
                    type="submit"
                    onClick={() => {
                      deleteBug(item.id);
                    }}
                  ></input>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
