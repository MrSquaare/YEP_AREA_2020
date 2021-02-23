import React, { FC, useState } from "react";
import AppBarComponent from "../../components/appbar/appbar";
import {
  makeStyles,
  withStyles,
  TextField,
  Theme,
  Fab,
} from "@material-ui/core";
import {
  WorkflowBloc,
  WorkflowDeleteEvent,
  WorkflowDeleteState,
  WorkflowErrorState,
  WorkflowReadEvent,
  WorkflowReadState,
  WorkflowUpdateEvent,
  WorkflowUpdateState,
  WorkflowRepository,
  WorkflowState,
} from "@area-common/blocs";
import { DefaultState } from "../../components/blocbuilder/default-state";
import { ErrorState } from "../../components/blocbuilder/error-state";
import WorkflowConfig from "../../components/workflow/workflowConfig";
import { Workflow } from "@area-common/types";
import { BlocBuilder } from "@felangel/react-bloc";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/router";
import { gray, primary } from "@area-common/styles";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: gray.main,
    height: "100%",
  },
  nameForm: {
    marginLeft: 125,
    marginTop: 40,
  },
  title: {
    color: primary.main,
    fontSize: 30,
    textDecoration: "underline",
    textUnderlinePosition: "under",
  },
  saveButton: {
    backgroundColor: primary.main,
    fontWeight: "bold",
    margin: "0px",
    top: "auto",
    right: "20px",
    bottom: "20px",
    left: "auto",
    position: "fixed",
  },
}));

const WorkflowPage: FC = () => {
  const router = useRouter();
  const { workflowId } = router.query;
  const workflowBloc = new WorkflowBloc(new WorkflowRepository(""));
  workflowBloc.add(new WorkflowReadEvent(workflowId as string));

  const handleWorkflowChange = (
    workflowId: string,
    updateWorkflow: Partial<Workflow>
  ) => {
    workflowBloc.add(new WorkflowUpdateEvent(workflowId, updateWorkflow));
  };

  return (
    <BlocBuilder
      bloc={workflowBloc}
      key={uuidv4()}
      condition={(_, current: WorkflowState) => {
        if (current instanceof WorkflowUpdateState) {
          workflowBloc.add(new WorkflowReadEvent(workflowId as string));
        }
        return true;
      }}
      builder={(state: WorkflowState) => {
        if (state instanceof WorkflowErrorState) {
          return <ErrorState errorLabel={"An error has occured"} />;
        }
        if (state instanceof WorkflowReadState) {
          return (
            <WorkflowEdit
              workflow={(state as WorkflowReadState).workflow}
              changeCallback={handleWorkflowChange}
            />
          );
        }
        return <DefaultState />;
      }}
    />
  );
};

const CssTextField = withStyles({
  root: {
    "& .MuiInput-underline:before": {
      borderBottomColor: primary.main,
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: primary.main,
    },
  },
})(TextField);

type Props = {
  workflow: Workflow;
  changeCallback: (
    workflowId: string,
    updateWorkflow: Partial<Workflow>
  ) => void;
};

const WorkflowEdit: FC<Props> = (props) => {
  const classes = useStyles();
  const [workflow, setWorkflow] = useState(props.workflow);

  const findBlobId: (id: string) => number = (id) => {
    return parseInt("0x" + id[id.length - 1]) % 10;
  };

  const handleWorkflowNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setWorkflow({ ...workflow, name: event.target.value });
  };

  const handleWorkflowChangeSubmit = () => {
    props.changeCallback(props.workflow.id, workflow);
  };

  return (
    <>
      <AppBarComponent />
      <div
        className={classes.root}
        style={{
          background:
            "url(/assets/images/blob" +
            findBlobId(props.workflow.id) +
            "_bg.svg) no-repeat center",
          backgroundSize: "75%",
        }}
      >
        <CssTextField
          id="workflowName"
          name="name"
          margin="normal"
          label=""
          className={classes.nameForm}
          InputProps={{ className: classes.title }}
          defaultValue={props.workflow.name}
          onChange={handleWorkflowNameChange}
        />
        <WorkflowConfig workflow={workflow} setWorkflow={setWorkflow} />
        <Fab
          variant={"extended"}
          className={classes.saveButton}
          onClick={handleWorkflowChangeSubmit}
        >
          Save changes
        </Fab>
      </div>
    </>
  );
};

export default WorkflowPage;