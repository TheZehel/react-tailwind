//Seo
import { Helmet } from "react-helmet";

import React, { useState, useEffect } from "react";

import { useParams, useNavigate } from 'react-router-dom';

import InputMask from "react-input-mask";

import { FaSyncAlt } from "react-icons/fa";
import { IoPaw } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import { FaRegCreditCard } from "react-icons/fa";
import { IoClose } from "react-icons/io5";


import card from "@material-tailwind/react/theme/components/card";

import axios from "axios";

import CryptoFunctions  from "../globalsubcomponentes/CryptoFunctions";

import LoadingIcon from "../cotacao-pet-love/components/icons/loadingIcon";

import CardBrands from "./components/icons/CardBrands";

import PixModa from "./components/subcomponents/PixModal";


const crypto = new CryptoFunctions();

const enviroment = process.env.REACT_APP_ENVIRONMENT;
const apiUrl = process.env[`REACT_APP_API_ENDPOINT_${(enviroment)}`];

const errorCodes = (code) => {
    if (!code || !/^[0-9]{1,}$/.test(code)){
        return 'Houve um problema ao processar seu pagamento. Por favor, tente novamente mais tarde.';
    }

    code = code.toString();

    const errorMessages = [            
        "O seu pagamento esta sendo processado pelo órgão de pagamento e será aprovado em até um dia útil.", //0
        "Houve um problema ao processar seu pagamento. Por favor, tente novamente mais tarde.", //1
        "Seu cartão foi recusado. Por favor, verifique os detalhes do seu cartão e tente novamente.", //2
        "O valor do seu pedido excede o limite de crédito do seu cartão. Por favor, tente um cartão diferente.", //3
        "Ocorreu um erro ao processar seu pagamento. Por favor, aguarde alguns minutos antes de tentar novamente.", //4
        "A compra não foi autorizada pela operadora do cartão de crédito.", //5
        "Cartão desabilitado. Entre em contato com a operadora do cartão de crédito.", //6
        "Cartão vencido ou data de vencimento incorreta. Por favor, verifique os dados do cartão.", //7
        "Código de segurança inválido. Por favor, verifique os dados do cartão.", //8
        "Cartão com restrição. Entre em contato com a operadora do cartão de crédito.", //9
        "O pagamento não foi aprovado pela operadora do cartão de crédito. Por favor, verifique os dados do cartão e tente novamente.", //10 
        "Pagamento recusado por excesso de retentativas. Por favor, aguarde alguns instantes e tente novamente." //11            
    ];

    switch (code) {
        case "1000":
        case "1007":
        case "1019":
        case "1022":
        case "1035":
        case "1040":
        case "9200":
        case "2000":
        case "2002":
            return errorMessages[5];
        case "1001":
        case "1045":
            return errorMessages[7];
        case "1004":
            return errorMessages[9];
        case "1009":
            return errorMessages[10];
        case "1016":
            return errorMessages[3];
        case "1025":
            return errorMessages[6];
        case "9201":
            return errorMessages[11];
        case "9113":
            return errorMessages[4];
    }

    return 'Houve um problema ao processar seu pagamento. Por favor, tente novamente mais tarde.';
};

function InvoicePayment({newer}) {
    const [paymentMethod, setPaymentMethod] = useState("current-card");
    const [processing, setProcessing] = useState(true);
    const [errorList, setErrorList] = useState([]);
    const [errorAlert, setErrorAlert] = useState(null);
    const [displaySuccess, setDisplaySuccess] = useState(false);    
    const [document, setDocument] = useState({});
    const [subscription, setSubscription] = useState({});
    const [invoice, setInvoice] = useState({});
    const [encrypted, setEncrypted] = useState(null);
    const [petList, setPetList] = useState([]);
    const [pixModal, setPixModal] = useState(false);

    var params = useParams();
    params = { ...params };

    const {
        subscriptionId
    } = params;


    const [cardData, setCardData] = useState({
        name: "",
        number: "",
        expiration: "",
        cvv: ""
    });

    const inputHandler = (e) => {
        if (!e || !e.target || !e.target.name) {
            return;
        }

        var {
            value,
            name
        } = e.target;

        if (name.includes("card-")) {
            let label = name.replace("card-", "");

            if (errorList.includes(name)) {
                let erros = errorList.filter((error) => error != name);
                setErrorList([...erros]);
            }

            setCardData({...cardData, [label]: value});
            return;
        }
    };

    const validateInput = (input, value) => {
        if (input == "card-name") {
            let name = value || '';
            name = name.toString().trim();
        
            if (name.length < 4){ 
                return false; 
            }

            return true
        }

        if (input == "card-number") {
            var cartaoPattern = /^[0-9]{4}\s[0-9]{4}\s[0-9]{4}\s[0-9]{4}$/;

            if (!cartaoPattern.test(value)) return false;             
        
            let numeroCartao = value.replace(/[^0-9]+/g, "").toString();
        
            let soma = 0;
            let dobrar = false;
        
            for (let i = numeroCartao.length - 1; i >= 0; i--) {
                let digito = parseInt(numeroCartao.charAt(i), 10);
        
                if (dobrar) { 
                    if ((digito *= 2) > 9) digito -= 9;                      
                }
        
                soma += digito; 
                dobrar = !dobrar;
            }
        
            if ((soma % 10) != 0) return false;             
        
            return true;
        }

        if (input == "card-expiration") {
            let pattern_A = /^(\d{2})\/(\d{4})$/;
            let pattern_B = /^(\d{2})\/(\d{2})$/; 
            let datePattern = /^(\d{4})\-(\d{2})\-(\d{2})$/;
        
            if (!pattern_A.test(value) && !pattern_B.test(value)) return false;             
            
            let hoje = (new Date()).toISOString().split('T')[0];
        
            let [, hojeAno, hojeMes, hojeDia] = datePattern.exec(hoje);
        
            if (pattern_A.test(value)){
                let [, mes, ano] = pattern_A.exec(value);
                
                if (parseInt(mes) < 1) return false;
        
                if (parseInt(mes) > 12) return false; 
        
                if (parseInt(hojeAno) > parseInt(ano)) return false; 
        
                if (parseInt(hojeAno) == parseInt(ano) && parseInt(hojeMes) > parseInt(mes) ) return false; 
        
                return true
            }
        
            let [, mes, ano] = pattern_B.exec(value);
            ano = `20${ano}`;
        
            if (parseInt(mes) < 1 ) return false;             
        
            if (parseInt(mes) > 12 ) return false;             
        
            if (parseInt(hojeAno) > parseInt(ano)) return false;             
        
            if (parseInt(hojeAno) == parseInt(ano) && parseInt(hojeMes) > parseInt(mes)) return false;             
        
            return true;
        }

        if (input == "card-cvv") {
            if (/^[0-9]{3,4}$/.test(value)) return true;            

            return false;        
        }
    };

    const encryptCard = async () => {
        if (processing) return;       

        try {
            await fetch('/publicKey.pem')
                .then((response) => response.text())
                .then(async (publicKey) => {
                    var subscription_id = 'sub_' + subscriptionId;

                    var card = { ...cardData };

                    var encrypted = crypto.encryptData(JSON.stringify({ ...card, subscription_id }), publicKey);                    

                    console.log('Encrypted:', encrypted);

                    setProcessing(true);
                    setCardData({ ...card });                    
                    setEncrypted(encrypted);
                })
                .catch((error) => {
                    console.error('Erro ao carregar a chave pública:', error);
                });
        }catch(error){
            console.error('Não foi possível criptogradar os dados de pagamento.', error);
        }
    };

    const retryPayment = () => {
        if (processing || (invoice && invoice.status == 'paid')) return;       

        setProcessing(true);
        
        try {
            axios.post(`${apiUrl}/petlove/checkout/try-subscription-charge${newer === true ? '/1' : ''}`, { subscription_id: 'sub_' + subscriptionId })
                .then((response)=>{
                    let data = response.data;

                    if (data && data.invoice && data.invoice.status) {
                        setInvoice({ ...data.invoice });

                        if (data.invoice.status == 'paid') {
                            setDisplaySuccess(true);
                            setErrorAlert(null);
                        }else{
                            let transaction = { ...data.invoice };
                            transaction = { ...transaction.charge };
                            transaction = { ...transaction.last_transaction };

                            let code = transaction.acquirer_return_code || '0';
                            let message = errorCodes(code);

                            setErrorAlert({ message, delay: 8000 });
                        }
                    }

                    console.log('Pagamento processado com sucesso!', data);

                    setProcessing(false);                
                })
                .catch((err)=>{
                    let error = err;

                    if (error && error.response) {
                        error = error.response;
                    }

                    if (error && error.data) {
                        error = error.data;
                    }

                    console.error('Erro ao processar pagamento', error);

                    setProcessing(false);                
                });

        } catch(e) {
            let error = e;
            console.error('Erro ao processar retentativa de pagamento', error);
        }    
    };

    const displaySuccessMessage = () => {
        if (displaySuccess) {
            setTimeout(() => {
                setDisplaySuccess(null);
            }, 8000);
        }

        return (
            <div className={`px-3 w-full fixed z-[100] transition-all duration-800 ease-in-out ${displaySuccess ? 'top-1' : '-top-full'}`}>
                <div className="bg-green-100 border border-green-400 text-green-700 px-1 py-3 rounded relative pr-5 sm:px-4" role="alert">
                    <span className="block pr-3 sm:inline sm:pr-0">Sua assinatura foi ativada com sucesso!</span>
                    <span 
                        className="absolute top-0 bottom-0 right-0 px-2 py-3 mr-2"
                        onClick={() => { setDisplaySuccess(null); }}
                    > 
                        <IoClose className="hover:bluePrime w-[24px] h-[24px] cursor pointer" />
                    </span>
                </div>
            </div> 
        )
    }

    const displayErrorMessage = () => {   
        let error = { ...errorAlert };
    
        if (error && error.delay){
            setTimeout(() => {
                setErrorAlert(null);
            }, error.delay);
        }
    
        return(
          <div className={`px-3 w-full fixed z-[100] transition-all duration-800 ease-in-out ${error.message ? 'top-1' : '-top-full'}`}>
            <div className="bg-red-100 border border-red-400 text-red-700 px-1 py-3 rounded relative pr-5 sm:px-4" role="alert">
                <span className="block pr-3 sm:inline sm:pr-0">{error.message}</span>
                <span 
                    className="absolute top-0 bottom-0 right-0 px-2 py-3 mr-2"
                    onClick={() => { setErrorAlert(null); }}
                > 
                    <IoClose className="hover:bluePrime w-[24px] h-[24px] cursor pointer" />
                </span>
            </div>
          </div>  
        );
    };

    useEffect(()=>{
        try {
            if (!encrypted || !processing || !subscriptionId) {
                if (processing) { setProcessing(false); }
                return;
            }

            axios.post( `${apiUrl}/petlove/checkout/update-subscription-charge${newer === true ? '/1' : ''}`, { encrypted } )
                .then((response)=>{
                    let data = response.data;

                    if (data && data.invoice && data.invoice.status) {
                        setInvoice({ ...data.invoice });

                        if (data.invoice.status == 'paid') {
                            setDisplaySuccess(true);
                            setErrorAlert(null);
                        }else{
                            let transaction = { ...data.invoice };
                            transaction = { ...transaction.charge };
                            transaction = { ...transaction.last_transaction };

                            let code = transaction.acquirer_return_code || '0';
                            let message = errorCodes(code);

                            setErrorAlert({ message, delay: 8000 });
                        }
                    }

                    console.log('Pagamento processado com sucesso!', data);

                    setProcessing(false);
                    setEncrypted(null);
                })
                .catch((err)=>{
                    let error = err;

                    if (error && error.response) {
                        error = error.response;
                    }

                    if (error && error.data) {
                        error = error.data;
                    }

                    console.error('Erro ao processar pagamento', error);

                    setProcessing(false);
                    setEncrypted(null);
                });
        }catch(e){
            console.error('Erro ao carregar dados de pagamento', e);
        }
    }, [encrypted]);

    useEffect(()=>{
        if (!subscriptionId) {
            return;
        }

        axios.get(`${apiUrl}/petlove/process/get-invoice-data/${subscriptionId}${newer === true ? '/1' : ''}`)
            .then((response) => {
                var { data } = response;

                if (!data || !data.document || !data.subscription || !data.invoice) {
                    console.log("Erro ao carregar dados!");
                    return;
                }

                var {
                    document,
                    subscription,
                    invoice
                } = data;         

                setSubscription(subscription);
                setDocument(document);
                setInvoice(invoice);

                let petList = [];
                
                if (document && document.petlove && document.petlove.plans && Array.isArray(document.petlove.plans)) {
                    petList = [...document.petlove.plans];
                }

                if (document && document.petlove && document.petlove.pets && Array.isArray(document.petlove.pets)) {
                    for (let i in document.petlove.pets) {
                        let pet = document.petlove.pets[i];

                        if (!pet.plan) {
                            pet.plan = {};
                        }

                        petList[i].plan = pet.plan.title;
                    }
                }

                setPetList(petList);
            })
            .catch((err) => {
                let error = err;

                if (error && error.response) {
                    error = error.response;
                }

                if (error && error.data) {
                    error = error.data;
                }

                console.log('Erro na requisição', error);
            });
    }, []);

    useEffect(()=>{
        try {
            if (!invoice || !invoice.id || !subscriptionId) {
                return;
            }

            axios.get(`${apiUrl}/petlove/process/get-invoice-data/${subscriptionId}${newer === true ? '/1' : ''}`)
                .then((response) => {
                    var { data } = response;

                    if (!data || !data.document || !data.subscription || !data.invoice) {
                        console.log("Erro ao carregar dados!");
                        return;
                    }

                    var {
                        document,
                        subscription,
                    } = data;         

                    setSubscription(subscription);
                    setDocument(document);

                    let petList = [];
                    
                    if (document && document.petlove && document.petlove.plans && Array.isArray(document.petlove.plans)) {
                        petList = [...document.petlove.plans];
                    }

                    if (document && document.petlove && document.petlove.pets && Array.isArray(document.petlove.pets)) {
                        for (let i in document.petlove.pets) {
                            let pet = document.petlove.pets[i];

                            if (!pet.plan) {
                                pet.plan = {};
                            }

                            petList[i].plan = pet.plan.title;
                        }
                    }

                    setPetList(petList);
                })
                .catch((err) => {
                    let error = err;

                    if (error && error.response) {
                        error = error.response;
                    }

                    if (error && error.data) {
                        error = error.data;
                    }

                    console.log('Erro na requisição', error);
                });
        } catch(e){
            console.error('Erro ao atualizar invoice', e);
        }
    }, [invoice]);



    const [pixOrder, setPixOrder] = useState(null);
    const [pixCharge, setPixCharge] = useState(null);

    const payWithPix = async () => {
        if (pixModal) return;

        if (pixOrder) {
            setPixModal(true);
            return;
        }
        
        var url = `https://api-primesecure.onrender.com/petlove/invoice/pix-subscription-charge${newer == true ? '/1' : ''}`;
        if (enviroment == 'SANDBOX') url = `http://localhost:3050/petlove/invoice/pix-subscription-charge${newer == true ? '/1' : ''}`;

        await axios.post(url, { subscription_id: 'sub_' + subscriptionId })
            .then((response) => {
                const { data } = response || {};
                var { order, error } = data || {};

                console.log('Pix Order:', data);

                if (error) {
                    console.error('Erro ao processar pagamento com Pix', error);
                    setPixOrder(null);
                    setPixModal(false);
                    return;
                }

                setPixModal(true);
                setPixOrder(order);
            })
            .catch((err) => {
                let error = err;

                if (error && error.response) error = error.response;   
                if (error && error.data) error = error.data;                

                console.error('Erro ao processar pagamento com Pix', error);
                setPixOrder(null);
                setPixModal(false);
            });
    }

    useEffect(()=>{
        const handlePixPayment = async () => {
            if (!pixOrder) return;

            var { charges, status, metadata, id: order_id } = pixOrder || {};
            if ((!Array.isArray(charges) && charges.length > 0) || status == 'paid') return;
            
            var { metadata = {} } = pixOrder || {};
            var { product, produto, tipo, id_assinatura: subscription_id, id_fatura: invoice_id } = metadata || {};

            if ((product != "petlove" && produto != "petlove") || tipo != "pagamento_fatura") return;
            if (!subscription_id || !invoice_id) return;

            var { last_transaction, id: charge_id } = charges[0] || {};
            if (!last_transaction) return;

            const now = new Date();

            var { qr_code, qr_code_url, expires_at, transaction_type, amount } = last_transaction || {};

            if (!qr_code || !qr_code_url || !expires_at || !transaction_type) return;
            if (transaction_type != 'pix') return;

            var expires = new Date(expires_at);
            if (expires.getTime() < now.getTime()) return;

            console.log("PIX CHARGE:", { order_id, charge_id, qr_code, qr_code_url, expires_at, amount });

            setPixCharge({ order_id, charge_id, qr_code, qr_code_url, expires_at, amount });
        };

        handlePixPayment();        
    },[pixOrder]);

    useEffect(()=>{
        if (!pixCharge || !pixCharge.order_id) return;
        const eventSource = new EventSource('https://api-primesecure.onrender.com/petlove/invoice/waiting-for-pix/' + pixCharge.order_id);
        console.log("SSE STARTED");
        
        eventSource.onmessage = (event) => {
            const newMessage = JSON.parse(event.data);
            
            console.log('SSE:', newMessage);

            var { status, order_id } = newMessage || {};
            if (order_id == pixCharge.order_id && status == 'paid') {
                setPixCharge({ ...pixCharge, status: 'paid' });
                setPixOrder(null);

                var _invoice = { ...invoice };
                _invoice.status = 'paid';
                if (_invoice.charge) _invoice.charge.status = 'paid';
                
                setPixModal(false);
                setInvoice(_invoice);
                setDisplaySuccess(true);

                eventSource.close();
            }
        };
    
        eventSource.onerror = (event) => {
            console.error('Error occurred while receiving SSE', event);
            eventSource.close();
        };

        return () => { eventSource.close(); };
    }, [pixCharge]);

    console.log('Subscription:', subscription);
    console.log('Invoice:', invoice);  
    console.log('Document:', document);

    console.log('PetList:', petList)

    var invoiceData = {
        date: (invoice.cycle) ? invoice.cycle.start_at : "",
        value: (invoice.amount) ? invoice.amount : "",
        cycle: (invoice.cycle) ? invoice.cycle.cycle : ""
    }

    try{
        if (invoiceData.date) {
            let date = new Date(invoiceData.date);
            
            if (!date.getTime()){
                invoiceData.date = "";
                return;
            }

            let day = date.getDate().toString().padStart(2, '0');
            let month = (date.getMonth() + 1).toString().padStart(2, '0');
            let year = date.getFullYear().toString();
          
            invoiceData.date = `${day}/${month}/${year}`;
        }
    }catch(e){
        console.error('Erro ao carregar data da fatura', e);
    }

    try{
        if (invoiceData.value && /^[0-9]{1,}$/.test(invoiceData.value)) {
            invoiceData.value = (parseFloat(invoiceData.value) / 100).toFixed(2);
            invoiceData.value = invoiceData.value.replace('.', ',');
        }else{
            invoiceData.value = "";
        }
    }catch(e){
        console.error('Erro ao carregar valor da fatura', e);
    }

    var subCard = { ...subscription.card };

    var petlove = { ...document.petlove };
    
    if ( !petlove.region ){
        petlove.region = {};
    }

    console.log('errorList', errorList);

    return (
        <div className="InvoicePayment">
            {displaySuccessMessage()}
            {displayErrorMessage()}
            <Helmet>
                <title>Plano de Saúde PetLove | Prime Secure Marketplace</title>
                <meta
                    name="description"
                    content="O Plano de Saúde Pet oferece uma ampla rede de clínicas e profissionais qualificados para o bem-estar completo do seu pet."
                />

                <meta
                    name="keywords"
                    content="Prime Secure, Seguros, Insurance, Insurtech, Corretora de Seguros, MarketPlace de Seguros, Plano de Saúde Pet, Saúde Pet, Plano Pet, Prime, Cobertura para Pets, Seguro para Cães, Seguro para Gatos, Plano de Saúde para Animais, Assistência Veterinária, Cobertura Veterinária, Plano de Saúde Animal, Seguro Pet Online, Seguro Pet Confiável, Seguro para Animais de Estimação, Cuidados com Pets, Bem-estar Animal, Plano Pet Completo, Plano Pet Personalizado, Seguro Pet Integral, Seguro Pet Emergencial"
                />
                <meta
                    property="og:title"
                    content="Plano de Saúde PetLove | Prime Secure Marketplace"
                />
                <meta
                    property="og:description"
                    content="O Plano de Saúde Pet oferece uma ampla rede de clínicas e profissionais qualificados para o bem-estar completo do seu pet."
                />
                <meta
                    property="og:image"
                    content="https://banco-de-imagens-webapp-primesecure.s3.sa-east-1.amazonaws.com/social-petlove-by-primesecure.png"
                />
                <meta
                    property="og:url"
                    content="https://primesecure.com.br/seguro-pet-porto"
                />
                <link
                    rel="canonical"
                    href="https://primesecure.com.br/seguro-pet-porto"
                />
            </Helmet>
            <div className="w-full flex mt-5">
                <img 
                    src="https://storage.googleapis.com/primesecure/pet-love-logo.png" 
                    alt="Logo Petlove" 
                    className={`mx-auto w-[140px] sm:w-[160px]`} 
                /> 
            </div>
            <div
                className="w-full flex flex-wrap justify-center gap-x-[15px] mt-5 sm:mt-8"
            >
                <div
                    className="w-1/2 min-w-[330px] max-w-[420px]"
                >                    
                    <div
                        className="py-[20px] pl-[20px] flex bg-white shadow-petlove-shadow rounded-lg"
                    >
                        
                            <FaUserCircle className="min-w-[34px] w-[34px] min-h-[34px] h-[34px] my-auto text-bluePrime opacity-70"/>                           
                        
                        <div
                            className="w-full ml-[10px] text-[14px]"
                        >
                            <div
                                className="font-semibold h-[17px] leading-[17px] text-[15px] text-left"
                            >
                                {(subscription.customer) ? subscription.customer.name : "" }
                            </div>
                            <div
                                className="font-medium h-[17px] leading-[17px] mt-[2px] text-left"
                            >
                                {(subscription.customer) ? subscription.customer.email : "" }
                            </div>                            
                        </div>                        
                    </div>
                    <div
                        className="p-[20px] my-[15px] bg-white shadow-petlove-shadow rounded-lg"
                    >
                        <div
                            className="flex mb-[20px]"
                        >
                            <div 
                                className="min-w-[34px] w-[34px] min-h-[34px] h-[34px] flex"
                            >
                                <div 
                                    className="min-w-[34px] w-[34px] min-h-[34px] h-[34px] mx-auto rounded-full bg-[#4E2096]/[0.5] overflow-hidden flex"
                                >
                                    <IoPaw className="m-auto text-[#FFFFFF] w-[22px] h-[22px]" />
                                </div>

                            </div>
                            <div
                                className="w-full ml-[10px] my-auto text-left"
                            >
                                <div className="w-full h-[17px] leading-[17px] text-[15px] font-bold">
                                    Planos Petlove
                                </div>          
                                <div className={`text-[12px] font-semibold h-[17px] leading-[17px] mt-[2px] text-left opacity-60 ${(petlove.region.city) ? "" : "hidden"}`}>
                                    { petlove.region.city ? petlove.region.city : "" }
                                </div>                 
                            </div>                                
                        </div>
                        {
                            petList.map((pet, index)=>{
                                let { status } = pet;

                                if (status == 'suspend') status = "Suspenso";                               

                                if (status == 'active') status = "Ativo";                                
           
                                return (
                                    <div className="w-full mt-[15px] p-[15px] rounded-lg bg-white border border-black/10 shadow-petlove-shadow flex" >
                                        <div className="" >
                                            <div className="font-semibold text-[14px] text-left" >
                                                {pet.pet}
                                            </div>
                                            <div className="font-medium text-[13px] text-left" >
                                                {pet.plan}
                                            </div>
                                        </div>
                                        <div className={`text-[11px] leading-[10px] py-[8px] px-[10px] rounded-lg ml-auto my-auto font-semibold ${pet.status == 'suspend' ? 'text-[#805B36] bg-[#FFD8B2]' : 'text-[#4F7F40] bg-[#E4F7C8]' }`} >
                                            { status }
                                        </div>
                                    </div>
                                )
                            })
                        }

                    </div>
                </div>
                <div
                    className="w-1/2 min-w-[330px] max-w-[420px] "
                >
                    <div
                        className="py-[20px] p-[20px] flex bg-white shadow-petlove-shadow rounded-lg"
                    >
                        <div 
                            className="min-w-[34px] w-[34px] min-h-[34px] h-[34px] my-auto rounded-full bg-[#9EFF7C] overflow-hidden flex"
                        >
                            <FaSyncAlt className="m-auto text-[#FFFFFF] w-[20px] h-[20px]" />
                        </div>
                        <div
                            className="ml-[10px] text-[12px] "
                        >
                            <div
                                className="font-semibold h-[17px] leading-[17px] text-left"
                            >
                                Cobrança - {invoiceData.date}
                            </div>
                            <div
                                className="font-semibold h-[17px] leading-[17px] mt-[2px] text-left"
                            >
                                Valor: R$ {invoiceData.value}
                            </div>                            
                        </div> 
                        <div
                            className={`text-[11px] leading-[10px] py-[8px] px-[10px] rounded-lg ml-auto my-auto font-semibold 
                                ${(invoice.status == 'paid') ? "text-[#4F7F40] bg-[#E4F7C8]" : "text-[#C63737] bg-[#FFCDD2]"}
                            `} 
                        >
                            {(invoice.status == 'paid') ? 'Pago' : 'Falhou'}
                        </div>                       
                    </div>
                    <div
                        className="p-[20px] mt-[15px] bg-white shadow-petlove-shadow rounded-lg"
                    >
                        <div
                            className="flex mb-[20px]"
                        >
                            <div 
                                className="min-w-[34px] w-[34px] min-h-[25px] h-[25px] flex"
                            >
                                <div 
                                    className="min-w-[30px] w-[30px] min-h-[30px] h-[30px] mx-auto rounded-full flex"
                                >
                                    <FaRegCreditCard className="m-auto text-bluePrime w-[26px] h-[26px]" />
                                </div>

                            </div>
                            <div
                                className="w-full ml-[10px] text-[15px] font-bold my-auto text-left"
                            >
                                <div
                                    className="leading-[16px]"
                                >
                                    Pagamento de Fatura 
                                </div>   
                                <div
                                    className="font-semibold text-[11px] text-left opacity-60"
                                >
                                    Recorrência: {invoiceData.cycle} de 12    
                                </div>         
                            </div>                                
                        </div>
                        <div
                            className={`
                                w-full h-[50px] mt-[15px] pl-[15px] pr-[20px] rounded-lg bg-white shadow-petlove-shadow flex border 
                                ${paymentMethod == "current-card" ? "border-[#03A8DB] cursor-default" : "border-[#000000]/[0.08] cursor-pointer text-[#666666]"}
                            `}
                            onClick={()=>{ 
                                if (paymentMethod != 'current-card' && !processing && invoice.status != 'paid') setPaymentMethod('current-card');                                 
                                if (invoice.status == 'paid') setPaymentMethod('current-card');                                
                            }}
                        >
                            <div
                                className={`w-[42px] h-[42px] mr-[5px] my-auto flex ${paymentMethod != "current-card" ? "opacity-50" : "" }`}
                            >
                                <CardBrands brand={subCard.brand} />
                            </div>
                            <div
                                className="ml-[5px] text-[13px] font-semibold my-auto"
                            >
                                {subCard.brand}
                            </div>
                            <div
                                className="ml-[15px] text-[13px] font-semibold my-auto flex"
                            >
                                
                                <div className="w-fit h-fit my-auto leading-[10px] mr-[5px] pt-[3px]">****</div> 
                                <div className="">{subCard.last_digits}</div>
                            </div>
                            <div
                                className={`h-[16px] w-[16px] rounded-full ml-auto my-auto flex border-[2px] ${paymentMethod == "current-card" ? "border-[#03A8DB]" : "border-[#000000]/[0.3]"} `} 
                            >
                                <div
                                    className={`h-[8px] w-[8px] rounded-full  m-auto ${
                                        paymentMethod != "current-card" ? (paymentMethod != "pix") ? "hidden bg-[#000000]/[0.3]" : "bg-[#000000]/[0.3]" : "bg-[#03A8DB]"}`}
                                >                                    
                                </div>
                            </div>
                        </div>
                        <div
                            className={`w-full h-[50px] mt-[10px] pl-[15px] pr-[20px] rounded-lg bg-white shadow-petlove-shadow flex border 
                                ${paymentMethod == "new-card" ? "border-[#03A8DB] cursor-default hidden" : "border-[#000000]/0.08 cursor-pointer"}
                                ${invoice.status == "paid" ? "hidden" : ""}
                            `}
                            onClick={()=>{ 
                                if (paymentMethod != 'new-card' && !processing && invoice.status != 'paid') setPaymentMethod('new-card');                                
                                if (invoice.status == 'paid')  setPaymentMethod('current-card');                                
                            }}
                        >
                            <div
                                className={`w-[42px] h-[42px] mr-[5px] my-auto flex`}
                            >
                                <FaRegCreditCard className="m-auto text-[#666666] opacity-80 w-[24px] h-[24px]" />
                            </div>
                            <div
                                className="ml-[5px] text-[13px] font-semibold my-auto text-[#666666]"
                            >
                                Novo cartão de crédito
                            </div>
                            <div
                                className={`h-[16px] w-[16px] rounded-full border-[2px] ml-auto my-auto flex ${paymentMethod == "new-card" ? "border-[#03A8DB]" : "border-[#000000]/[0.3]"}`}
                            >
                                <div
                                    className={`h-[8px] w-[8px] rounded-full bg-[#03A8DB] m-auto ${paymentMethod == "new-card" ? "" : "hidden"}`}
                                >                                    
                                </div>
                            </div>
                        </div>
                        <div
                            className={`w-full px-[20px] rounded-lg bg-white shadow-petlove-shadow overflow-hidden 
                                ${paymentMethod != "new-card" ? "max-h-0 mt-0" : "max-h-max border border-[#03A8DB] mt-[15px]"} 
                                ${invoice.status == "paid" ? "hidden" : ""}
                            `}
                        >
                            <div
                                className="w-full text-[13px] text-left font-semibold my-3"
                            >
                                Novo Cartão de Crédito
                            </div>
                            <input
                                name="card-name"
                                type="text"
                                className={`w-full px-4 py-1 text-[13px] border-0 ring-1 rounded-md focus:ring-2 focus:ring-inset focus:ring-bluePrime placeholder 
                                    ${(errorList.includes('card-name')) ? "ring-alertRed" : "ring-bluePrime"}
                                `}
                                placeholder="Nome Impresso no Cartão"
                                value={cardData.name}
                                onChange={inputHandler}
                            />
                            <InputMask
                                name="card-number"
                                type="text"
                                className={`w-full px-4 py-1 mt-3 text-[13px] border-0 ring-1 rounded-md focus:ring-2 focus:ring-inset focus:ring-bluePrime placeholder 
                                    ${(errorList.includes('card-number')) ? "ring-alertRed" : "ring-bluePrime"}
                                `}
                                placeholder="Número do Cartão"
                                mask={"9999 9999 9999 9999"}
                                maskChar={null}
                                value={cardData.number}
                                onChange={inputHandler}
                            />
                            <div
                                className="flex mt-3 gap-3"
                            >
                                <InputMask
                                    name="card-expiration"
                                    type="text"
                                    className={`w-full px-4 py-1 text-[13px] border-0 ring-1 rounded-md focus:ring-2 focus:ring-inset focus:ring-bluePrime placeholder 
                                        ${(errorList.includes('card-expiration')) ? "ring-alertRed" : "ring-bluePrime"}
                                    `}
                                    placeholder="Vencimento"
                                    mask={"99/9999"}
                                    maskChar={null}
                                    value={cardData.expiration}
                                    onChange={inputHandler}
                                />
                                <InputMask
                                    name="card-cvv"
                                    type="text"
                                    className={`w-full px-4 py-1 text-[13px] border-0 ring-1 rounded-md focus:ring-2 focus:ring-inset focus:ring-bluePrime placeholder 
                                        ${(errorList.includes('card-cvv')) ? "ring-alertRed" : "ring-bluePrime"}
                                    `}
                                    placeholder="CVV"
                                    mask={"999"}
                                    maskChar={null}
                                    value={cardData.cvv}
                                    onChange={inputHandler}
                                />
                            </div>
                            <div
                                className={`w-full mt-4 mb-3 text-center font-medium text-white text-[14px] h-[32px] rounded-[6px] inline-flex items-center transition ease-in-out duration-150 
                                    ${(processing) ? "cursor-not-allowed bg-bluePrime2 hover:bg-bluePrime2 " : "cursor-pointer bg-[#41D134] hover:bg-greenPromo " } 
                                    ${(invoice.status == 'paid') ? "cursor-not-allowed bg-[#313131]/[0.6] hover:bg-[#313131]/[0.6]" : " " }
                                `}
                                onClick={()=>{
                                    if (processing) { return; }
                                    if (invoice && invoice.status == 'paid') { return; }

                                    let valid = true;
                                    let inputs = ['card-name', 'card-number', 'card-expiration', 'card-cvv'];

                                    let errors = [];

                                    for(let i in inputs){
                                        let input = inputs[i];
                                        input = input.replace('card-', '');

                                        if (!validateInput(inputs[i], cardData[input])){
                                            errors.push(inputs[i]);
                                            valid = false;
                                        }
                                    }

                                    setErrorList([...errorList, ...errors]);

                                    if (!valid){ return; }

                                    encryptCard();
                                }}
                            >
                                <div className="flex m-auto">
                                    <LoadingIcon display={(processing && invoice.status != 'paid')} />
                                    {(processing) ? 'Processando' : 'Pagar Fatura'}
                                </div>
                            </div>
                        </div>
                        <div
                            className={`w-full h-[50px] mt-[10px] mb-3 pl-[15px] pr-[20px] rounded-lg bg-white shadow-petlove-shadow flex border
                                ${paymentMethod == "pix" ? "border-[#03A8DB] cursor-default" : "border-[#000000]/0.08 cursor-pointer"}
                                ${invoice.status == "paid" ? "hidden" : ""}
                            `}
                            onClick={()=>{ 
                                if (paymentMethod != 'pix' && !processing && invoice.status != 'paid') setPaymentMethod('pix');                                 
                                if (invoice.status == 'paid') setPaymentMethod('pix');                                
                            }}
                        >
                            <div
                                className={`w-[42px] h-[42px] mr-[5px] my-auto flex`}
                            >
                                <CardBrands brand="pix" color={(paymentMethod == "pix") ? "#32bcad" : "#858585"} />
                            </div>
                            <div
                                className={`ml-[5px] text-[13px] font-semibold my-auto ${paymentMethod != 'pix' ? 'text-[#666666]' : ''}`}
                            >
                                Pagar fatura com Pix
                            </div>
                            <div
                                className={`h-[16px] w-[16px] rounded-full border-[2px] ml-auto my-auto flex ${paymentMethod == "pix" ? "border-[#03A8DB]" : "border-[#000000]/[0.3]"}`}
                            >
                                <div
                                    className={`h-[8px] w-[8px] rounded-full bg-[#03A8DB] m-auto ${paymentMethod == "pix" ? "" : "hidden"}`}
                                >                                    
                                </div>
                            </div>
                        </div>
                        <div
                            className={`w-full mt-1 text-center font-medium text-white text-[14px] h-[32px] rounded-[6px] inline-flex items-center transition ease-in-out duration-150 
                                ${ (paymentMethod == "new-card") ? "hidden " : "" } 
                                ${ (processing) ? "cursor-not-allowed bg-bluePrime2 hover:bg-bluePrime2 " : "cursor-pointer bg-[#41D134] hover:bg-greenPromo " }      
                                ${ (invoice.status == 'paid') ? "hidden " : " " }                       
                            }`}
                            onClick={()=>{
                                if (processing) return; 
                                if (invoice && invoice.status == 'paid') return; 
                                if (paymentMethod == "pix") {                                     
                                    payWithPix();
                                    return; 
                                }
                                retryPayment();
                            }}
                        >
                            <div className="flex m-auto font-semibold">
                                <LoadingIcon display={(processing && invoice.status != 'paid')} />
                                {(processing) ? 'Processando' : (paymentMethod == "pix") ? 'Pagar com Pix' : 'Pagar Fatura'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>   
            <PixModa isOpen={pixModal} onClose={()=>{setPixModal(false)}} orderTotal={1000} transaction={pixCharge} expired={()=>{ setPixModal(false); }} />        
        </div>
    );

}

export default InvoicePayment;