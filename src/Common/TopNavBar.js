import React, { useState } from "react";
import styled from "styled-components";
import Logo from "../Assets/Logo";
import DeleteButton from "../Assets/DeleteButton";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { Credential } from "../Atoms/LoginAtom";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

const TopNavBar = () => {
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const [credential, setCredential] = useRecoilState(Credential);

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      // fetching userinfo can be done on the client or the server
      const userInfo = await axios
        .get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        })
        .then((res) => res.data);

      const response = await axios
        .get(`${process.env.REACT_APP_SERVER_URL}/user/${userInfo.email}`)
        .then((res) => res.data);

      if (response === "") {
        const user = await axios
          .post(`${process.env.REACT_APP_SERVER_URL}/user/create`, {
            name: userInfo.name,
            email: userInfo.email,
            image: userInfo.picture,
            temperature: 36.5,
            region: "경상북도 포항시 북구",
          })
          .then((res) => res.data);

        setCredential(user);
      } else {
        setCredential(response);
      }
    },
    onFailure: (err) => {
      console.log(err);
    },
  });

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleDeleteClick = () => {
    setInput("");
  };

  const handleChatClick = () => {
    navigate("/mypage");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <Container>
      <InnerContent>
        <Link
          to="/"
          style={{
            all: "unset",
            marginRight: "3.6rem",
            display: "inline-flex",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <span>
            <Logo />
          </span>
        </Link>
        <Nav>
          <Ul>
            <Li>
              <NavBarLink
                to="/fleamarket"
                style={({ isActive }) =>
                  isActive ? { color: "#FF6F0F", opacity: 1 } : {}
                }
              >
                중고거래
              </NavBarLink>
            </Li>
            <Li>
              <NavBarLink
                to="/nearby_stores"
                style={({ isActive }) =>
                  isActive ? { color: "#FF6F0F", opacity: 1 } : {}
                }
              >
                동네업체
              </NavBarLink>
            </Li>
            <Li>
              <NavBarLink
                to="/jobs"
                style={({ isActive }) =>
                  isActive ? { color: "#FF6F0F", opacity: 1 } : {}
                }
              >
                알바
              </NavBarLink>
            </Li>
            <Li>
              <NavBarLink
                to="/realty"
                style={({ isActive }) =>
                  isActive ? { color: "#FF6F0F", opacity: 1 } : {}
                }
              >
                부동산 직거래
              </NavBarLink>
            </Li>
            <Li>
              <NavBarLink
                to="/car"
                style={({ isActive }) =>
                  isActive ? { color: "#FF6F0F", opacity: 1 } : {}
                }
              >
                중고차 직거래
              </NavBarLink>
            </Li>
          </Ul>
        </Nav>
        <InputBar>
          <span>
            <Form onSubmit={handleSubmit}>
              <Input
                type="search"
                placeholder="물품이나 동네를 검색해보세요"
                value={input}
                onChange={handleInputChange}
              />
              {input === "" ? null : (
                <Delete onClick={handleDeleteClick}>
                  <DeleteButton />
                </Delete>
              )}
            </Form>
          </span>
          <span>
            <ChatButton onClick={credential === null ? login : handleChatClick}>
              {credential === null ? "구글 로그인" : "마이페이지"}
            </ChatButton>
          </span>
        </InputBar>
      </InnerContent>
    </Container>
  );
};

export default TopNavBar;

const Container = styled.div`
  background-color: white;
  color: #212124;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  max-width: 100vw;
  z-index: 999;
`;

const InnerContent = styled.div`
  max-width: 120rem;
  height: 6.4rem;
  padding: 1.2rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: 0 auto;
  position: relative;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  width: 100%;
  padding-right: 4rem;
`;

const Ul = styled.ul`
  display: inline-block;
  list-style: none;
`;

const Li = styled.li`
  display: inline-block;
`;

const NavBarLink = styled(NavLink)`
  all: unset;
  line-height: 1.32;
  font-size: 1.8rem;
  font-weight: 700;
  margin-right: 3rem;
  color: #4d5159;
  cursor: pointer;

  &:hover {
    opacity: 0.7;
  }
`;

const InputBar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Form = styled.form`
  display: block;
  position: relative;
  margin-right: 1.2rem;
`;

const Input = styled.input`
  width: 28.8rem;
  line-height: 1.36;
  font-size: 1.6rem;
  background-color: #f2f3f6;
  height: 4rem;
  margin: 1.6rem 0;
  padding: 0.9rem 1.2rem;
  border: none;
  border-radius: 0.6rem;

  &::-webkit-search-cancel-button {
    display: none;
  }
`;

const Delete = styled.span`
  position: absolute;
  height: 100%;
  top: 0;
  right: 1.2rem;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const ChatButton = styled.button`
  line-height: 1.3;
  font-size: 1.6rem;
  display: block;
  white-space: nowrap;
  background-color: white;
  font-weight: 700;
  min-height: 4rem;
  padding: 0 1.6rem;
  border-radius: 0.4rem;
  border: 1px solid #d1d3d8;
  cursor: pointer;
  width: fit-content;

  &:hover {
    background-color: #f2f3f6;
    color: #21212480;
    transition: background-color 0.15s;
    will-change: background-color;
  }
`;
