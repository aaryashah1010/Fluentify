// @ts-nocheck
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
import "dotenv/config";
import { GoogleGenerativeAI } from '@google/generative-ai';
async function testGeminiAPI() {
  if (stryMutAct_9fa48("4108")) {
    {}
  } else {
    stryCov_9fa48("4108");
    console.log(stryMutAct_9fa48("4109") ? "" : (stryCov_9fa48("4109"), '🧪 Testing Gemini API Key...\n'));

    // Check if API key is set
    if (stryMutAct_9fa48("4112") ? false : stryMutAct_9fa48("4111") ? true : stryMutAct_9fa48("4110") ? process.env.GEMINI_API_KEY : (stryCov_9fa48("4110", "4111", "4112"), !process.env.GEMINI_API_KEY)) {
      if (stryMutAct_9fa48("4113")) {
        {}
      } else {
        stryCov_9fa48("4113");
        console.log(stryMutAct_9fa48("4114") ? "" : (stryCov_9fa48("4114"), '❌ ERROR: GEMINI_API_KEY is not set in .env file'));
        console.log(stryMutAct_9fa48("4115") ? "" : (stryCov_9fa48("4115"), 'Please add your Gemini API key to the .env file:'));
        console.log(stryMutAct_9fa48("4116") ? "" : (stryCov_9fa48("4116"), 'GEMINI_API_KEY=your_actual_api_key_here'));
        return;
      }
    }
    console.log(stryMutAct_9fa48("4117") ? "" : (stryCov_9fa48("4117"), '✅ API key found in environment variables'));
    try {
      if (stryMutAct_9fa48("4118")) {
        {}
      } else {
        stryCov_9fa48("4118");
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        // Try different model names that might be available
        const modelsToTry = stryMutAct_9fa48("4119") ? [] : (stryCov_9fa48("4119"), [stryMutAct_9fa48("4120") ? "" : (stryCov_9fa48("4120"), 'gemini-1.5-pro'), stryMutAct_9fa48("4121") ? "" : (stryCov_9fa48("4121"), 'gemini-1.5-flash-latest'), stryMutAct_9fa48("4122") ? "" : (stryCov_9fa48("4122"), 'gemini-pro'), stryMutAct_9fa48("4123") ? "" : (stryCov_9fa48("4123"), 'gemini-1.0-pro'), stryMutAct_9fa48("4124") ? "" : (stryCov_9fa48("4124"), 'gemini-2.0-flash'), stryMutAct_9fa48("4125") ? "" : (stryCov_9fa48("4125"), 'gemini-2.0-flash-latest')]);
        console.log(stryMutAct_9fa48("4126") ? "" : (stryCov_9fa48("4126"), '🔍 Testing available models...\n'));
        let workingModel = null;
        let workingModelName = null;
        for (const modelName of modelsToTry) {
          if (stryMutAct_9fa48("4127")) {
            {}
          } else {
            stryCov_9fa48("4127");
            try {
              if (stryMutAct_9fa48("4128")) {
                {}
              } else {
                stryCov_9fa48("4128");
                console.log(stryMutAct_9fa48("4129") ? `` : (stryCov_9fa48("4129"), `Trying model: ${modelName}...`));
                const model = genAI.getGenerativeModel(stryMutAct_9fa48("4130") ? {} : (stryCov_9fa48("4130"), {
                  model: modelName
                }));
                const testPrompt = stryMutAct_9fa48("4131") ? "" : (stryCov_9fa48("4131"), 'Say "OK" if you can read this.');
                const result = await model.generateContent(testPrompt);
                const response = await result.response;
                const text = response.text();
                console.log(stryMutAct_9fa48("4132") ? `` : (stryCov_9fa48("4132"), `✅ ${modelName} works!\n`));
                workingModel = model;
                workingModelName = modelName;
                break;
              }
            } catch (error) {
              if (stryMutAct_9fa48("4133")) {
                {}
              } else {
                stryCov_9fa48("4133");
                console.log(stryMutAct_9fa48("4134") ? `` : (stryCov_9fa48("4134"), `❌ ${modelName} failed: ${error.message.split(stryMutAct_9fa48("4135") ? "" : (stryCov_9fa48("4135"), '\n'))[0]}`));
              }
            }
          }
        }
        if (stryMutAct_9fa48("4138") ? false : stryMutAct_9fa48("4137") ? true : stryMutAct_9fa48("4136") ? workingModel : (stryCov_9fa48("4136", "4137", "4138"), !workingModel)) {
          if (stryMutAct_9fa48("4139")) {
            {}
          } else {
            stryCov_9fa48("4139");
            console.log(stryMutAct_9fa48("4140") ? "" : (stryCov_9fa48("4140"), '\n❌ None of the common models are available'));
            console.log(stryMutAct_9fa48("4141") ? "" : (stryCov_9fa48("4141"), 'This might be an API key issue or API version mismatch'));
            return;
          }
        }
        console.log(stryMutAct_9fa48("4142") ? "" : (stryCov_9fa48("4142"), '📡 Running full API test...'));
        const testPrompt = stryMutAct_9fa48("4143") ? "" : (stryCov_9fa48("4143"), 'Hello! Please respond with just "API key is working" if you can read this message.');
        const result = await workingModel.generateContent(testPrompt);
        const response = await result.response;
        const text = response.text();
        console.log(stryMutAct_9fa48("4144") ? "" : (stryCov_9fa48("4144"), '\n🎉 SUCCESS! Gemini API is working!'));
        console.log(stryMutAct_9fa48("4145") ? "" : (stryCov_9fa48("4145"), '📝 API Response:'), stryMutAct_9fa48("4146") ? text : (stryCov_9fa48("4146"), text.trim()));
        console.log(stryMutAct_9fa48("4147") ? `` : (stryCov_9fa48("4147"), `🤖 Working model: ${workingModelName}`));
        console.log(stryMutAct_9fa48("4148") ? "" : (stryCov_9fa48("4148"), '🔑 API Key Status: Valid and active\n'));
        console.log(stryMutAct_9fa48("4149") ? "" : (stryCov_9fa48("4149"), '✅ You can now generate AI-powered language courses!'));
        console.log(stryMutAct_9fa48("4150") ? `` : (stryCov_9fa48("4150"), `\n💡 Update your geminiService.js to use: '${workingModelName}'`));
      }
    } catch (error) {
      if (stryMutAct_9fa48("4151")) {
        {}
      } else {
        stryCov_9fa48("4151");
        console.log(stryMutAct_9fa48("4152") ? "" : (stryCov_9fa48("4152"), '\n❌ ERROR: Gemini API test failed'));
        console.log(stryMutAct_9fa48("4153") ? "" : (stryCov_9fa48("4153"), '📋 Error details:'), error.message);
        if (stryMutAct_9fa48("4155") ? false : stryMutAct_9fa48("4154") ? true : (stryCov_9fa48("4154", "4155"), error.message.includes(stryMutAct_9fa48("4156") ? "" : (stryCov_9fa48("4156"), 'API_KEY_INVALID')))) {
          if (stryMutAct_9fa48("4157")) {
            {}
          } else {
            stryCov_9fa48("4157");
            console.log(stryMutAct_9fa48("4158") ? "" : (stryCov_9fa48("4158"), '\n🔧 SOLUTION: Your Gemini API key is invalid'));
            console.log(stryMutAct_9fa48("4159") ? "" : (stryCov_9fa48("4159"), '   1. Go to https://makersuite.google.com/app/apikey'));
            console.log(stryMutAct_9fa48("4160") ? "" : (stryCov_9fa48("4160"), '   2. Create a new API key'));
            console.log(stryMutAct_9fa48("4161") ? "" : (stryCov_9fa48("4161"), '   3. Replace the key in your .env file'));
            console.log(stryMutAct_9fa48("4162") ? "" : (stryCov_9fa48("4162"), '   4. Run this test again'));
          }
        } else if (stryMutAct_9fa48("4164") ? false : stryMutAct_9fa48("4163") ? true : (stryCov_9fa48("4163", "4164"), error.message.includes(stryMutAct_9fa48("4165") ? "" : (stryCov_9fa48("4165"), 'QUOTA_EXCEEDED')))) {
          if (stryMutAct_9fa48("4166")) {
            {}
          } else {
            stryCov_9fa48("4166");
            console.log(stryMutAct_9fa48("4167") ? "" : (stryCov_9fa48("4167"), '\n🔧 SOLUTION: API quota exceeded'));
            console.log(stryMutAct_9fa48("4168") ? "" : (stryCov_9fa48("4168"), '   1. You\'ve used up your free tier quota'));
            console.log(stryMutAct_9fa48("4169") ? "" : (stryCov_9fa48("4169"), '   2. Wait for the quota to reset (usually daily)'));
            console.log(stryMutAct_9fa48("4170") ? "" : (stryCov_9fa48("4170"), '   3. Or upgrade to a paid plan'));
          }
        } else if (stryMutAct_9fa48("4172") ? false : stryMutAct_9fa48("4171") ? true : (stryCov_9fa48("4171", "4172"), error.message.includes(stryMutAct_9fa48("4173") ? "" : (stryCov_9fa48("4173"), 'fetch')))) {
          if (stryMutAct_9fa48("4174")) {
            {}
          } else {
            stryCov_9fa48("4174");
            console.log(stryMutAct_9fa48("4175") ? "" : (stryCov_9fa48("4175"), '\n🔧 SOLUTION: Network connection issue'));
            console.log(stryMutAct_9fa48("4176") ? "" : (stryCov_9fa48("4176"), '   1. Check your internet connection'));
            console.log(stryMutAct_9fa48("4177") ? "" : (stryCov_9fa48("4177"), '   2. Make sure you can access Google services'));
            console.log(stryMutAct_9fa48("4178") ? "" : (stryCov_9fa48("4178"), '   3. Try again in a few minutes'));
          }
        } else {
          if (stryMutAct_9fa48("4179")) {
            {}
          } else {
            stryCov_9fa48("4179");
            console.log(stryMutAct_9fa48("4180") ? "" : (stryCov_9fa48("4180"), '\n🔧 SOLUTION: Unknown error'));
            console.log(stryMutAct_9fa48("4181") ? "" : (stryCov_9fa48("4181"), '   1. Check your API key format'));
            console.log(stryMutAct_9fa48("4182") ? "" : (stryCov_9fa48("4182"), '   2. Make sure @google/generative-ai is installed'));
            console.log(stryMutAct_9fa48("4183") ? "" : (stryCov_9fa48("4183"), '   3. Try running: npm install @google/generative-ai'));
          }
        }
        console.log(stryMutAct_9fa48("4184") ? "" : (stryCov_9fa48("4184"), '\n💡 Need help? Get a new API key at: https://makersuite.google.com/app/apikey'));
      }
    }
  }
}

// Run the test
testGeminiAPI();