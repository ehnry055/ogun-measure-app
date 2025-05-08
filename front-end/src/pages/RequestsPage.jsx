import React, { useEffect, useState } from 'react';
import '../styles/App.css'; 
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";


const RequestsPage = () => {
  const [email, setEmail] = useState();
  const [role, setRole] = useState();
  const [affiliation, setAffiliation] = useState();
  const [funding, setFunding] = useState();
  const [intention, setIntention] = useState();
  const [share, setShare] = useState();
  const [when, setWhen] = useState();
  const [area, setArea] = useState();
  const [target, setTarget] = useState();
  const [data, setData] = useState();
  const { isAuthenticated, getAccessTokenSilently, isLoading } = useAuth0();

  const sendMail = async () => {
    console.log("done");
    try {
      const token = await getAccessTokenSilently();
      await axios.get("/api/sendEmail", {
        params: {
          email,
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
      console.log("done");
    } catch (error) {
      console.error('error', error);
    }
  };


  return (
    <div>
      <input
        type="text"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <textarea
        placeholder="Role (e.g., Student, Postdoc, Faculty, Researcher, Policy Analyst, other)"
        onChange={(e) => setRole(e.target.value)}
      />
      <br />
      <textarea
        placeholder="Affiliation (e.g., Academic, Government, Non-Profit, Private Sector, other)"
        onChange={(e) => setAffiliation(e.target.value)}
      />
      <br />
      <textarea
        placeholder="Funding Source (if applicable)"
        onChange={(e) => setFunding(e.target.value)}
      />
      <br />
      <textarea
        placeholder="Data Use Intentions (e.g., Publication, Policy Report, Internal Analysis, other)"
        onChange={(e) => setIntention(e.target.value)}
      />
      <br />
      <textarea
        placeholder="How and when will you share your findings with community members and organizations?"
        onChange={(e) => setShare(e.target.value)}
      />
      <br />
      <textarea
        placeholder="When will you complete the final document based on this research?"
        onChange={(e) => setWhen(e.target.value)}
      />
      <br />
      <textarea
        placeholder="Which geographic area of the US are you interested in exploring?"
        onChange={(e) => setArea(e.target.value)}
      />
      <br />
      <textarea
        placeholder="Target Population"
        onChange={(e) => setTarget(e.target.value)}
      />
      <br />
      <textarea
        placeholder="Data analysis program"
        onChange={(e) => setData(e.target.value)}
      />
      <br />
      <button onClick={sendMail}>Send Email</button>
    </div>
  );
}

export default RequestsPage;