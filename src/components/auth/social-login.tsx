import { useTranslation } from 'next-i18next';
import { useState, useCallback } from 'react';
import { IResolveParams } from 'reactjs-social-login';
import { FcGoogle } from 'react-icons/fc';
import { BsFacebook } from 'react-icons/bs';
import { AiFillTwitterCircle } from 'react-icons/ai';
import { IoLogoApple } from 'react-icons/io';
import Router from 'next/router';
import { allowedRoles, setAuthCredentials } from '@/utils/auth-utils';
// CUSTOMIZE ANY UI BUTTON
import Logo from '@/components/ui/logo';
import { FacebookLoginButton } from 'react-social-login-buttons';
import { TwitterLoginButton } from 'react-social-login-buttons';
import { GoogleLoginButton } from 'react-social-login-buttons';
import { AppleLoginButton } from 'react-social-login-buttons';
import Loader from '../ui/loader/loader';
import { GetFunctionBDetail, GetSocialData } from '@/services/Service';
import moment from 'moment';
import { toast } from 'react-toastify';
import { Routes } from '@/config/routes';
import cn from 'classnames';
import styles from '@/components/ui/loader/loader.module.css';
import Modal from '@/components/ui/modal/modal';
import Card from '../common/card';
import { AiOutlineRight } from 'react-icons/ai';

const LoginForm = () => {
  const { t } = useTranslation();
  const [provider, setProvider] = useState('');
  const [profile, setProfile] = useState<any>();
  const [loadingData, setloadingData] = useState(false);

  const REDIRECT_URI = window.location.href;
  const [
    LoginSocialFacebook,
    setLoginSocialFacebook,
  ] = useState<React.ComponentType<any> | null>(null);
  const [
    LoginSocialTwitter,
    setLoginSocialTwitter,
  ] = useState<React.ComponentType<any> | null>(null);
  const [
    LoginSocialGoogle,
    setLoginSocialGoogle,
  ] = useState<React.ComponentType<any> | null>(null);
  const [LoginSocialApple, setLoginSocialApple] = useState<React.ComponentType<
    any
  > | null>(null);

  const isBrowser = typeof window !== 'undefined';

  if (isBrowser && !LoginSocialFacebook) {
    import('reactjs-social-login').then((module) => {
      setLoginSocialFacebook(module.LoginSocialFacebook);
    });
  }
  if (isBrowser && !LoginSocialTwitter) {
    import('reactjs-social-login').then((module) => {
      setLoginSocialTwitter(module.LoginSocialTwitter);
    });
  }
  if (isBrowser && !LoginSocialGoogle) {
    import('reactjs-social-login').then((module) => {
      setLoginSocialGoogle(module.LoginSocialGoogle);
    });
  }
  if (isBrowser && !LoginSocialApple) {
    import('reactjs-social-login').then((module) => {
      setLoginSocialApple(module.LoginSocialApple);
    });
  }

  const getBusinessDetails = (token) => {
    GetFunctionBDetail('/business-details', token).then((result) => {
      localStorage.setItem(
        'business_details',
        JSON.stringify(result.data.currency)
      );

      localStorage.setItem(
        'user_business_details',
        JSON.stringify(result.data)
      );
      localStorage.setItem('business_name', result.data.name);
    });
    GetFunctionBDetail('/product', token).then((result) => {
      localStorage.setItem('product_list', JSON.stringify(result.data));
    });
    GetFunctionBDetail('/user/loggedin', token).then((result) => {
      localStorage.setItem('user_detail', JSON.stringify(result.data));
    });
    toast.success('Login Successfully');
    setTimeout(() => {
      Router.push(Routes.dashboard);
    }, 1000);
  };

  const onGmailSuccess = (data) => {
    setloadingData(true);
    GetSocialData('/get-user-business?email=' + data.email).then((result) => {
      if (result.success) {
        if (result.data.length > 0) {
          Router.push({
            pathname: '/selectUser',
            query: { data: JSON.stringify(result.data) },
          });
        } else {
          GetSocialData('/user-login/' + result.data[0].id).then((result) => {
            localStorage.setItem('user_token', result?.token);
            setAuthCredentials(result?.token);
            getBusinessDetails(result?.token);
            setloadingData(false);
          });
        }
      } else {
        localStorage.setItem('userFName', data.given_name);
        localStorage.setItem('userLName', data.family_name);
        localStorage.setItem('userEmail', data.email ? data.email : '');
        Router.push(Routes.businessDetail);
      }
    });
  };
  const onFacebookSuccess = (data) => {
    localStorage.setItem('userFName', data.first_name);
    localStorage.setItem('userLName', data.last_name);
    localStorage.setItem('userEmail', data.email ? data.email : '');
    Router.push(Routes.businessDetail);
  };

  if (loadingData)
    return (
      <div>
        <div
          className={cn('flex w-full flex-col items-center justify-center')}
          style={{ height: 'calc(50vh - 200px)' }}
        >
          <div className={styles.loading} />
        </div>
      </div>
    );

  return (
    <>
      {provider && profile ? (
        <Loader text={t('common:text-loading')} />
      ) : (
        <div className="flex justify-center">
          {LoginSocialFacebook && (
            <LoginSocialFacebook
              appId="950913272736930"
              onResolve={({ provider, data }: IResolveParams) => {
                onFacebookSuccess(data);
              }}
              onReject={(err) => {
                console.log(err);
              }}
            >
              <div className="w-12 p-3">
                <BsFacebook
                  color="#2D86FF"
                  className="h-8 w-8 cursor-pointer"
                />
              </div>
            </LoginSocialFacebook>
          )}
          {LoginSocialGoogle && (
            <LoginSocialGoogle
              client_id="187532650466-51uleg6rg1kglgn1v0seqqsflvjhcvo1.apps.googleusercontent.com"
              onResolve={({ provider, data }: IResolveParams) => {
                onGmailSuccess(data);
              }}
              onReject={(err) => {
                console.log(err);
              }}
            >
              <div className="w-12 p-3">
                <FcGoogle className="h-8 w-8 cursor-pointer" />
              </div>
            </LoginSocialGoogle>
          )}
          {/* {LoginSocialTwitter && (
            <LoginSocialTwitter
              isOnlyGetToken
              client_id={process.env.REACT_APP_TWITTER_V2_APP_KEY || ''}
              redirect_uri={''}
              // onLoginStart={onLoginStart}
              onResolve={({ provider, data }: IResolveParams) => {
                setProvider(provider);
                setProfile(data);
              }}
              onReject={(err: any) => {
                console.log(err);
              }}
            >
              <div className="w-12 p-3">
                <AiFillTwitterCircle color="#1D9BF0" className="h-9 w-9" />
              </div>
            </LoginSocialTwitter>
          )} */}
          {/* {LoginSocialApple && (
            <LoginSocialApple
              client_id="com.ignite.login"
              scope={'name email'}
              redirect_uri={REDIRECT_URI}
              onResolve={({ provider, data }: IResolveParams) => {
                setProvider(provider);
                setProfile(data);
              }}
              onReject={(err) => {
                console.log(err);
              }}
            >
              <div className="w-12 p-3">
                <IoLogoApple color="#666666" className="h-9 w-9" />
              </div>
            </LoginSocialApple>
          )} */}
        </div>
      )}
    </>
  );
};

export default LoginForm;
