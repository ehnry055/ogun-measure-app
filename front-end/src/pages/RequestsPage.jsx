import React, { useEffect, useState } from "react";
import "../styles/App.css";
import "../styles/HomePage.css";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import InfoPopup from "../components/InfoPopup";

const RequestsPage = () => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const [funding, setFunding] = useState("");
  const [intention, setIntention] = useState("");
  const [share, setShare] = useState("");
  const [when, setWhen] = useState("");
  const [area, setArea] = useState("");
  const [target, setTarget] = useState("");
  const [data, setData] = useState("");

  const { user, getAccessTokenSilently } = useAuth0();

  // Prefill form from URL parameters
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);

      setName(params.get("name") || "");
      setRole(params.get("role") || "");
      setAffiliation(params.get("affiliation") || "");
      setFunding(params.get("funding") || "");
      setIntention(params.get("intention") || "");
      setShare(params.get("share") || "");
      setWhen(params.get("when") || "");
      setArea(params.get("area") || "");
      setTarget(params.get("target") || "");
      setData(params.get("data") || "");
    }

    const demoUrl = `${window.location.origin}${window.location.pathname}?${new URLSearchParams(
      {
        name: "Dr. Jane Smith",
        role: "Researcher",
        affiliation: "National Institutes of Health (NIH)",
        funding: "NIH Intramural Research Program",
        intention: "Peer-reviewed publication and clinical guidelines",
        share: "NIH website and annual report (2025)",
        when: "December 2025",
        area: "National (US-wide)",
        target: "Patients with Alzheimer's in Marginalized Communities",
        data: "Bioinformatics tools",
      }
    ).toString()}`;

    console.log("Demo prefilled URL:", demoUrl);
  }, []);

  const sendMail = async () => {
    try {
      // Keep this in case your backend expects an authenticated user/session
      await getAccessTokenSilently();

      const email = user?.email;

      await axios.get("/api/user/send-email", {
        params: {
          email,
          name,
          role,
          affiliation,
          funding,
          intention,
          share,
          when,
          area,
          target,
          data,
        },
      });

      alert("Email sent successfully!");
    } catch (error) {
      console.error("error", error);
      alert("Something went wrong sending the email.");
    }
  };

  return (
    <div className="home-container requests-center">
      <div className="form-container requests-form">
        <h2 className="about-title">
          Request Form{" "}
          <InfoPopup>
            <h2 style={{ color: "#8C68CD" }}>Request Page</h2>
            <p
              style={{
                textAlign: "center",
                margin: "0 20px",
                fontSize: "22px",
              }}
            >
              To request Registered User permissions, fill out the fields and
              click send email. This will send an email to an admin with the
              inputted information. An email will also be sent to the email
              address of the current user account.
              <br />
              <br />
              Registered Users will be able to access the Upload/Delete Data
              page for changing data.
            </p>
          </InfoPopup>
        </h2>

        <div className="request-question">
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="request-question">
          <label>
            Role (e.g., Student, Postdoc, Faculty, Researcher, Policy Analyst,
            other)
          </label>
          <textarea value={role} onChange={(e) => setRole(e.target.value)} />
        </div>

        <div className="request-question">
          <label>
            Affiliation (e.g., Academic, Government, Non-Profit, Private Sector,
            other)
          </label>
          <textarea
            value={affiliation}
            onChange={(e) => setAffiliation(e.target.value)}
          />
        </div>

        <div className="request-question">
          <label>Funding Source (if applicable)</label>
          <textarea
            value={funding}
            onChange={(e) => setFunding(e.target.value)}
          />
        </div>

        <div className="request-question">
          <label>
            Data Use Intentions (e.g., Publication, Policy Report, Internal
            Analysis, other)
          </label>
          <textarea
            value={intention}
            onChange={(e) => setIntention(e.target.value)}
          />
        </div>

        <div className="request-question">
          <label>
            How and when will you share your findings with community members and
            organizations?
          </label>
          <textarea value={share} onChange={(e) => setShare(e.target.value)} />
        </div>

        <div className="request-question">
          <label>
            When will you complete the final document based on this research?
          </label>
          <textarea value={when} onChange={(e) => setWhen(e.target.value)} />
        </div>

        <div className="request-question">
          <label>
            Which geographic area of the US are you interested in exploring?
          </label>
          <textarea value={area} onChange={(e) => setArea(e.target.value)} />
        </div>

        <div className="request-question">
          <label>Target Population</label>
          <textarea
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          />
        </div>

        <div className="request-question">
          <label>Data analysis program</label>
          <textarea value={data} onChange={(e) => setData(e.target.value)} />
        </div>

        <button type="button" className="send" onClick={sendMail}>
          Send Email
        </button>
      </div>
    </div>
  );
};

export default RequestsPage;
