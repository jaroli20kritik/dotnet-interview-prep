/* Day 1 */
DAYS[1]={title:"Types, memory, strings & constructors",week:"Week 1 · C# Fundamentals",
chips:["Value vs reference","Boxing","Nullable & DBNull","String vs StringBuilder","OOP pillars","Constructors"],
concepts:`
<h2>Aaj ka concept primer</h2>
<h3>Value vs reference types</h3>
<p>Value type (int, decimal, bool, struct, enum) ka variable <b>khud data hold karta hai</b>. Reference type (class, string, array, object) ka variable sirf ek <b>address</b> hold karta hai, aur actual object heap pe hota hai.</p>
<p><b>Analogy:</b> Value type photocopy jaisa hai. Copy pe kuch likho to original change nahi hota. Reference type Google Doc ka link jaisa hai. Link do logon ko bhejo, dono ek hi document edit karenge.</p>
<h3>Boxing / unboxing</h3>
<p>Value type ko <code>object</code> mein wrap karna boxing hai, jisse heap allocation hoti hai. Wapas nikalna unboxing hai, aur usme exact type ka explicit cast chahiye.</p>
<h3>String vs StringBuilder</h3>
<p>String immutable hai, isliye har <code>+=</code> naya object banata hai. StringBuilder ek mutable buffer hai, jo loops mein bahut fast hai.</p>
<h3>OOP ke 4 pillars</h3>
<ul><li><b>Encapsulation:</b> data chhupao, controlled access do.</li><li><b>Abstraction:</b> sirf "kya karta hai" dikhao, "kaise" nahi.</li><li><b>Inheritance:</b> common code reuse karo.</li><li><b>Polymorphism:</b> ek call, alag behaviour.</li></ul>
<h3>Constructors</h3>
<p>Default, parameterized, copy, static, private (aur C# 12 se primary constructor). Inheritance mein base constructor pehle chalta hai.</p>`,
qa:[
{t:"Value vs reference types?",s:0,
a:"Value types store the actual data, and assigning one to another creates an independent copy. Examples are int, decimal, bool, structs and enums. Reference types store a reference to an object on the managed heap, so two variables can point to the same object. Examples are classes, strings, arrays and delegates.",
h:"int a = 5; int b = a; b = 10; ke baad bhi a 5 hi rahega. Lekin Employee e2 = e1; e2.Name = \"X\"; karne se e1.Name bhi \"X\" ho jayega, kyunki dono same object ko point kar rahe hain.",
c:`var e1 = new Employee { Name = "Amit" };
var e2 = e1;           // reference copy
e2.Name = "Ravi";
Console.WriteLine(e1.Name); // Ravi`,
f:["Is string a value type? (No, it's a reference type that behaves like a value because it's immutable.)","What is the default value of each?"],
tip:"Interviewer check karta hai ki aapko copy semantics samajh aate hain. Sirf \"stack/heap\" ratna kaafi nahi hai."},
{t:"Are value types always stored on the stack?",s:0,
a:"No. Local value-type variables usually live on the stack, but a value-type field inside a class lives on the heap as part of that object. Boxed values and variables captured by lambdas are on the heap too. Where something is stored is an implementation detail. The real difference is copy semantics.",
h:"Class ke andar ka int field heap pe hi rahega, kyunki pura object heap pe hai. \"Value type = stack\" fresher wala answer hai, isliye yeh nuance bolna 4–5 saal wale candidate ki pehchaan hai.",
f:["Where is a struct stored when it's inside a List<T>?","What is a closure capture?"],
tip:"Yahan nuance dikhao, lekin lambi lecture mat do. 2–3 lines kaafi hain."},
{t:"How do ref, out and in differ?",s:0,
a:"ref passes a variable by reference, and it must be initialized before the call. out doesn't need initialization, but the method must assign it, as in int.TryParse. in passes by reference but read-only, which is useful for large structs to avoid copying.",
h:"ref = do-taraf ka raasta, value andar bhi jaati hai aur badal ke bahar bhi aati hai. out = sirf bahar aane ka raasta. in = andar jaata hai, lekin method usko badal nahi sakta.",
c:`if (int.TryParse(txtPlotNo.Text, out int plotNo))
{
    // use plotNo
}`,
f:["If you pass a reference type without ref and reassign it inside the method, does the caller see it? (No. Only changes to the object itself are visible.)"],
tip:"TryParse ka example sabse natural hai. Form input validation mein roz use hota hai."},
{t:"A legacy module stores thousands of ints in an ArrayList and it's slow. Why?",s:1,
a:"ArrayList stores items as object, so every int is boxed when added and unboxed when read. That means a heap allocation per item, extra GC pressure, and no compile-time type safety. I'd replace it with List<int>, which is generic and avoids boxing.",
h:"Har int ko ek \"dabbe\" (object) mein pack karke heap pe rakha ja raha hai, aur nikalte waqt wapas unpack ho raha hai. Hazaron items pe yeh kaafi mehenga padta hai. Generics mein yeh dabba hi nahi banta.",
c:`int i = 10;
object o = i;        // boxing (heap allocation)
int j = (int)o;      // unboxing
long k = (long)o;    // InvalidCastException: must unbox to the exact type`,
f:["Does string.Format(\"{0}\", 5) box?","Why are generics faster?"],
tip:"Legacy code ka example aapke MVC background ke saath fit baithta hai. Bas yeh mat bolna ki aapne yeh fix kiya, jab tak sach mein kiya na ho."},
{t:"A DB2 column can be NULL. How do you handle it in C#?",s:1,
a:"A DB NULL comes back as DBNull.Value, not C# null, so a direct cast throws. I map nullable columns to nullable types like decimal? or DateTime?, check for DBNull when reading, and send DBNull.Value when passing a null parameter.",
h:"Database ka NULL aur C# ka null alag cheezein hain. Reader se value DBNull.Value aati hai, aur usko seedha (decimal) mein cast karoge to InvalidCastException aayega. Isliye pehle check karo, phir nullable type mein daalo.",
c:`// C# + IBM DB2 provider
decimal? amount = reader["ALLOT_AMT"] == DBNull.Value
    ? (decimal?)null
    : Convert.ToDecimal(reader["ALLOT_AMT"]);

cmd.Parameters.Add(new DB2Parameter("@remarks",
    (object)remarks ?? DBNull.Value));

string city = applicant?.Address?.City ?? "N/A";`,
f:["What does ?. do?","?? vs ??=","What are nullable reference types (C# 8)?"],
tip:"Yeh real-world question hai, aur aapka DB2 experience yahan directly kaam aata hai."},
{t:"A CSV export of 50,000 rows built with += is very slow. Why?",s:1,
a:"Strings are immutable. Every += creates a new string and copies all the previous content, which becomes roughly O(n²) in a loop. StringBuilder uses a resizable buffer and appends in place, so it's dramatically faster for repeated concatenation.",
h:"Har += pe poori purani string copy hoke ek nayi string banti hai. 50,000 baar yeh karoge to memory aur time dono barbaad. StringBuilder ek hi buffer mein add karta jaata hai.",
c:`var sb = new StringBuilder();
foreach (var r in rows)
    sb.Append(r.Id).Append(',').Append(r.Name).AppendLine();
string csv = sb.ToString();`,
f:["When is plain + fine?","What is string interning?"],
tip:"\"Immutable\" word zaroor bolo, aur kyun slow hai woh bhi explain karo."},
{t:"Struct vs class — when would you use a struct?",s:0,
a:"A struct is a value type, best for small, immutable data like a coordinate or a money amount, roughly under 16 bytes. Structs can't inherit from other types but can implement interfaces. For entities with identity and behaviour, like an Employee or an Application, I use classes.",
h:"Struct chhota, halka data ke liye hai jiski apni \"identity\" nahi hoti, jaise (x, y) point. Jis cheez ka ID ho, jo database mein ek record ho, woh class honi chahiye.",
f:["Can a struct have a parameterless constructor? (Yes, since C# 10.)","What's a readonly struct?"],
tip:"\"Under 16 bytes, immutable\" bolna practical samajh dikhata hai."},
{t:"const vs readonly vs static readonly?",s:0,
a:"const is a compile-time constant, implicitly static, and gets baked into the calling assemblies. readonly is set at declaration or in the constructor, so it can differ per instance. static readonly is a runtime constant shared across instances, for example a value read from config.",
h:"const = compile hote hi value fix ho jaati hai. readonly = object bante waqt (constructor mein) set hota hai. static readonly = poori application ke liye ek baar, runtime pe set hota hai.",
c:`public const int MaxFileSizeMb = 5;
public readonly DateTime CreatedOn;          // set in ctor
public static readonly string AppName =
    ConfigurationManager.AppSettings["AppName"];`,
f:["Why can't const hold a DateTime?"],
tip:"Bonus point: changing a public const requires recompiling the dependent assemblies."},
{t:"Explain the four pillars of OOP with a practical example.",s:0,
a:"Encapsulation hides data behind methods and properties, like a private balance changed only through validated methods. Abstraction exposes what an object does, not how, for example an INotificationService.Send(). Inheritance reuses common code, like a BaseController with shared logging. Polymorphism lets one call behave differently, like Send() going via SMS or email depending on the implementation.",
h:"ATM socho. Andar ka cash aap directly nahi chhoo sakte (encapsulation). Aapko sirf \"Withdraw\" button dikhta hai (abstraction). Har bank ka ATM base ATM features inherit karta hai (inheritance). \"Withdraw\" har bank mein alag tarah process hota hai (polymorphism).",
f:["Which pillar does an interface support most?","Is C# fully object-oriented?"],
tip:"Definition ke saath web app wala example do. Textbook \"Animal → Dog\" se kaam nahi chalega."},
{t:"Abstraction vs encapsulation?",s:0,
a:"Abstraction is about design: showing only the relevant operations, achieved with interfaces and abstract classes. Encapsulation is about implementation: hiding internal state and controlling access through access modifiers and properties. Abstraction is what, encapsulation is how it's protected.",
h:"Abstraction = car ka steering aur pedal dikhana. Encapsulation = engine ko bonnet ke andar lock karna, taaki koi galti se chhed-chhaad na kare.",
f:["Give a code example of each."],
tip:"Yeh dono confuse karna sabse common galti hai. Ek line ka difference ratt lo."},
{t:"What types of constructors does C# have?",s:0,
a:"Default (parameterless), parameterized, copy (user-defined, since C# has no built-in one), static (runs once per type), and private (prevents external instantiation, used in Singleton or static-only classes). Since C# 12, classes can also have primary constructors.",
h:"Constructor object ko ready karta hai. Copy constructor C# khud nahi deta, aapko likhna padta hai. Private constructor ka matlab hai bahar se new nahi kar sakte.",
c:`public class Applicant {
    public string Name { get; }
    public Applicant() : this("Unknown") { }           // chaining
    public Applicant(string name) { Name = name; }      // parameterized
    public Applicant(Applicant other) : this(other.Name) { } // copy
}`,
f:["What is constructor chaining?","Can a constructor be virtual?"],
tip:"Copy constructor C# mein built-in nahi hai, yeh point interviewers ko pasand aata hai."},
{t:"When does a static constructor run? Give a use case.",s:1,
a:"It runs automatically once, before the first instance is created or any static member is accessed. It has no parameters or access modifiers, and you can't call it directly. A typical use is one-time initialization, like loading lookup data or a config value.",
h:"Static constructor application mein us class ke liye sirf ek hi baar chalta hai, aur woh bhi khud se. Isliye usko parameters ya public/private ki zarurat nahi hoti, kyunki aap usko kabhi call karte hi nahi.",
f:["What happens if a static constructor throws? (TypeInitializationException, and the type stays unusable for that process.)"],
tip:"Exception wala follow-up 4–5 saal wale level ka hai, usko yaad rakho."},
{t:"In inheritance, which constructor runs first?",s:0,
a:"The base class constructor runs before the derived constructor's body. If the base has no parameterless constructor, the derived class must call one explicitly using : base(...).",
h:"Pehle neev (base), phir upar ki manzil (derived). Agar base ko parameter chahiye to derived ko base(...) se dena padega, warna compile error aayega.",
c:`class BaseRepo { public BaseRepo(string conn) { } }
class PlotRepo : BaseRepo {
    public PlotRepo() : base("DB2Conn") { }
}`,
f:["What runs first, field initializers or the base constructor?"],
tip:"Compile error wala case zaroor batao, woh practical experience dikhata hai."},
{t:"Destructor/finalizer vs Dispose?",s:0,
a:"A finalizer (~ClassName) is called by the GC at an unpredictable time and is only a safety net for unmanaged resources. Dispose() from IDisposable releases resources deterministically, usually through a using block. For DB connections I always use using, so the connection goes back to the pool immediately.",
h:"Finalizer ka bharosa nahi kab chalega. Dispose aap khud, turant chalate ho. DB connection ko using mein rakho, taaki kaam khatam hote hi pool mein wapas chala jaaye. (Day 6 mein iska deep dive hoga.)",
c:`using (var conn = new DB2Connection(connStr))
{
    conn.Open();
    // ...
} // Dispose() called here, connection returns to pool`,
f:["What is the Dispose pattern?","What happens if you forget to close connections?"],
tip:"Connection pool ka mention aapke DB2 kaam se seedha link hota hai."},
{t:"You copy an object to back it up before editing, but the backup also changes. Why?",s:1,
a:"Assigning a reference type copies only the reference, so both variables point to the same object. I need a real copy: a shallow copy via MemberwiseClone or a copy constructor, or a deep copy if the object contains nested reference types like lists.",
h:"Aapne object ki copy nahi, sirf uska address copy kiya. Isliye dono ek hi cheez ko badal rahe hain. Shallow copy upar ki values copy karti hai, deep copy andar ki lists bhi.",
f:["Shallow vs deep copy?","How do C# records help? (The with expression, Day 6.)"],
tip:"Bug-story style mein answer do: kya hua → kyun hua → kaise fix kiya."},
{t:"Fee calculations are off by tiny amounts like 0.0000001. What's wrong?",s:1,
a:"They're probably using double, which is binary floating point and can't represent values like 0.1 exactly. For money I always use decimal, which is base-10 and precise to 28–29 digits. It also maps naturally to DB2 DECIMAL(p,s) columns.",
h:"double binary mein numbers store karta hai, isliye 0.1 exactly store hi nahi hota. Paise ke hisaab mein yeh chhoti galti bhi audit mein pakdi jaati hai. Isliye money = decimal, hamesha.",
c:`Console.WriteLine(0.1 + 0.2 == 0.3);    // False (double)
Console.WriteLine(0.1m + 0.2m == 0.3m); // True  (decimal)`,
f:["When is double acceptable?","How does DB2 DECIMAL(10,2) map to C#?"],
tip:"Government fee/payment modules ke context mein yeh bahut strong answer hai."},
{t:"== vs .Equals()?",s:0,
a:"For value types, both compare values. For reference types, == compares references unless the operator is overloaded. String overloads it to compare content. Equals can be overridden for value equality. If you override Equals, you must also override GetHashCode.",
h:"== default mein dekhta hai \"kya dono same object hain?\". String mein usko badal diya gaya hai taaki content compare ho. Equals override karo to GetHashCode bhi karo, warna Dictionary/HashSet galat chalenge.",
c:`object a = "test";
object b = new string("test".ToCharArray());
Console.WriteLine(a == b);      // False (reference compare via object)
Console.WriteLine(a.Equals(b)); // True  (string's override)`,
f:["Why must GetHashCode be overridden too?","What is ReferenceEquals?"],
tip:"GetHashCode wali baat bolna aapko fresher se alag karta hai."}
],
coding:[
{t:"C1 · Reverse a string",p:"Write a method <code>string Reverse(string input)</code> <b>without</b> using Array.Reverse, LINQ Reverse() or StringBuilder helpers. Handle null and empty input.",hint:"Do pointers socho: ek shuru se, ek end se."},
{t:"C2 · Character frequency",p:"Given <code>\"programming\"</code>, print each character's frequency (for example <code>g:2, m:2, r:2…</code>). Then write a second version using LINQ.",hint:"Dictionary&lt;char,int&gt; ya GroupBy."}],
sql:{schema:`-- DB2
CREATE TABLE EMPLOYEE (
  EMP_ID   INTEGER NOT NULL PRIMARY KEY,
  EMP_NAME VARCHAR(50),
  DEPT_ID  INTEGER,
  SALARY   DECIMAL(10,2),
  EMAIL    VARCHAR(100)
);`,
items:[
{t:"S1 · Second highest salary",p:"Find the second highest salary. Give at least 2 approaches, and think about what happens if two people share the top salary."},
{t:"S2 · Duplicate emails",p:"Find emails that appear more than once, along with their count."}]},
yourTurn:["Can a struct inherit from a class? Can it implement an interface?","What exactly happens in memory during unboxing, and when does it throw?","If I pass a List<int> to a method (without ref) and the method does list = new List<int>();, does the caller's list change? What if it does list.Add(5)?","Why is a static constructor not allowed to have access modifiers or parameters?","Scenario: a page shows \"Object reference not set to an instance of an object\" only for some applicants. How would you find and fix it?"],
revision:["Value type = copy of the data, reference type = copy of the address. Stack/heap is a detail, copy semantics is the real difference.","Boxing → heap allocation + GC pressure, so prefer generics.","DB NULL = DBNull.Value. Use T?, ?? and ?.","String is immutable, so use StringBuilder in loops.","Money = decimal, never double.","const (compile time) vs readonly (constructor) vs static readonly (runtime, shared).","Static constructor: once, automatic, no params. Base constructor runs before derived.","Override Equals → override GetHashCode too."],
review:null};
