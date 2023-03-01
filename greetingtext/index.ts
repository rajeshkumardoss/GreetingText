import {IInputs, IOutputs} from "./generated/ManifestTypes";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { GreetingText, IGreetingTextProps } from "./GreetingText";


export class greetingtext implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    private notifyOutputChanged: () => void;
	private theContainer: HTMLDivElement;

    /**
     * Empty constructor.
     */
    constructor()
    {

    }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
     */
    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement): void
    {
        // Add control initialization code
        this.notifyOutputChanged = notifyOutputChanged;
		this.theContainer = container;
    }


    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void
    {
        let returntext = "";
        let queryString = "";
    
        const multilinetext =
          context.parameters.MultilineText.raw == null
            ? ""
            : context.parameters.MultilineText.raw;
        const entityname =
          context.parameters.entityname.raw == null
            ? ""
            : context.parameters.entityname.raw;
        const requiredAttributeKey =
          context.parameters.requiredAttributeKey.raw == null
            ? ""
            : context.parameters.requiredAttributeKey.raw;
        const requiredAttributeValue =
          context.parameters.requiredAttributeValue.raw == null
            ? ""
            : context.parameters.requiredAttributeValue.raw;
        if (
          entityname != "" &&
          requiredAttributeKey != "" &&
          requiredAttributeValue != "" &&
          context.parameters.Lookup.raw[0] != null
        ) {
          const lookupValue = context.parameters.Lookup.raw[0];
    
          queryString = `?$select=${requiredAttributeValue}&$filter=contains(${requiredAttributeKey},'${lookupValue.name}')`;
        }
        this.GetEntityAttribute(entityname,queryString,context);
       
    }


      GetEntityAttribute = async (entityname: string,queryString: string,context :any) => {
        let returntext="";
        const requiredAttributeValue =context.parameters.requiredAttributeValue.raw==null?"":context.parameters.requiredAttributeValue.raw;
        
        await context.webAPI.retrieveMultipleRecords(entityname, queryString).then(
                    (response: ComponentFramework.WebApi.RetrieveMultipleResponse) => {

                        console.log(response);
                        for (const entity of response.entities) {
                            // Retrieve the value of _currencyAttributeName field
                         returntext = entity[requiredAttributeValue];
                         const props: IGreetingTextProps = {
                            name: returntext
                          };
                        // Add code to update control view
                        ReactDOM.render(
                            React.createElement(
                                GreetingText,
                                props
                            ),
                            this.theContainer
                        );
                        }});
        
        }




    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    public getOutputs(): IOutputs
    {
        return {};
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void
    {
        // Add code to cleanup control if necessary
    }
}
